// DuoSpark Gemini features (all on the Gemini API free tier):
//   invite   -> Gemini designs an SVG invite card for a date
//   playlist -> Gemini builds a date-night playlist
//   story    -> Gemini (with vision, if photos are sent) writes a memory story + photo captions
//   tts      -> Gemini TTS narrates the memory story
//   local    -> Gemini (grounded with Google Search when available) writes local date ideas for a city
// Prompts live on the server so the browser can't send arbitrary prompts.
const TEXT_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
const TTS_MODELS = ['gemini-3.8-flash-tts', 'gemini-2.5-flash-preview-tts'];
const s = (v, n = 300) => String(v ?? '').slice(0, n);

function prompts(task, d) {
  const date = `Date: "${s(d.title, 120)}" — ${s(d.desc)}. Vibe: ${s(d.vibe, 60)}. Mode: ${s(d.mode, 40)}.`;
  const names = `Couple: ${s(d.name1, 40)} & ${s(d.name2, 40)}.`;
  if (task === 'invite') return `Design a beautiful date-night invite card as a single SVG.
${names} ${date} When: ${s(d.when, 60)}.
Rules: viewBox="0 0 600 800"; only basic SVG shapes, gradients and <text>; no <script>, no <foreignObject>, no external images, links or fonts (use font-family="Georgia, serif" or "Helvetica, sans-serif").
Warm, romantic palette (cream, coral, deep brown). Include both names, the date title, when, and one short sweet line you write. Keep text inside the card.
Return JSON only: {"svg": "<svg ...>...</svg>"}`;
  if (task === 'playlist') return `Make a date-night playlist of 8 real, well-known songs that fit this date. Mix Hindi/Bollywood and English unless the vibe suggests otherwise.
${names} ${date}
Return JSON only: {"title": "playlist name (max 6 words)", "songs": [{"title": "...", "artist": "...", "why": "max 10 words"}]}`;
  if (task === 'story') return `Write a short, warm memory for a couple's Memory Wall.
${names} ${date}
Their notes after the date: A: "${s(d.note1)}" B: "${s(d.note2)}".
${d.photoCount ? `You also have ${d.photoCount} photo(s) from the date, in order. Write one short caption (max 12 words) for each, based on what you see.` : 'There are no photos.'}
The story: 60-90 words, second person ("you two"), specific to their notes, gentle and a little funny, no clichés. It will be read aloud.
Return JSON only: {"headline": "max 7 words", "story": "...", "captions": ["..."]}`;
  return null;
}

async function callText(apiKey, prompt, images) {
  const parts = [{ text: prompt }];
  for (const img of (images || []).slice(0, 4)) {
    const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(img || '');
    if (m && m[2].length < 1_500_000) parts.push({ inline_data: { mime_type: m[1], data: m[2] } });
  }
  let last = 'Gemini request failed';
  for (const model of TEXT_MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { temperature: 0.8, responseMimeType: 'application/json' } })
      });
      const data = await r.json();
      if (!r.ok) { last = data?.error?.message || last; continue; }
      const raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
      return { model, result: JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '')) };
    } catch (e) { last = e?.message || last; }
  }
  throw new Error(last);
}

function localPrompt(d) {
  return `Suggest 2 date ideas for a couple in ${s(d.city, 60)}, ${s(d.state, 60)}, ${s(d.country, 40) || 'India'} that use REAL, well-known places in or near that city
(a viewpoint, market, cafe street, lake, trail, heritage spot). Only use places you are confident exist. Mode: ${s(d.mode, 40)}. Budget: ${s(d.budget, 20)}.
Interests: ${s((d.interests || []).join(', '), 200)}. Avoid repeating: ${s((d.avoid || []).join('; '), 400)}.
Return ONLY JSON, no other text:
{"dates":[{"title":"max 7 words, include the place name","desc":"1 sentence, max 20 words","place":"exact place name","vibe":"e.g. Romantic · Easy",
"time":"e.g. 2 hrs","cost":"e.g. ~₹400","setting":"outdoor or indoor","energy":"low, medium or high","tags":["3 short tags"],
"preflight":["2 short prep tips"],"steps":[{"text":"step","time":"e.g. 5:00 PM"}]}]}  (3-5 steps each)`;
}
function parseJson(raw) {
  const t = String(raw || '').replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  const i = t.indexOf('{'), j = t.lastIndexOf('}');
  return JSON.parse(i >= 0 && j > i ? t.slice(i, j + 1) : t);
}
async function callLocal(apiKey, prompt) {
  let last = 'Gemini request failed';
  // First try with Google Search grounding (so places are real); then without.
  for (const grounded of [true, false]) {
    for (const model of TEXT_MODELS) {
      try {
        const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6 } };
        if (grounded) body.tools = [{ google_search: {} }]; else body.generationConfig.responseMimeType = 'application/json';
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const data = await r.json();
        if (!r.ok) { last = data?.error?.message || last; continue; }
        const cand = data?.candidates?.[0];
        const result = parseJson(cand?.content?.parts?.map(p => p.text || '').join(''));
        const sources = (cand?.groundingMetadata?.groundingChunks || []).map(c => c?.web?.uri).filter(Boolean).slice(0, 3);
        return { model, grounded: grounded && sources.length > 0, sources, result };
      } catch (e) { last = e?.message || last; }
    }
  }
  throw new Error(last);
}

async function callTts(apiKey, text) {
  let last = 'TTS failed';
  for (const model of TTS_MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Read this warmly and softly, like a friend telling a sweet story: ${text}` }] }],
          generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
        })
      });
      const data = await r.json();
      if (!r.ok) { last = data?.error?.message || last; continue; }
      const part = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData || p.inline_data);
      const inline = part?.inlineData || part?.inline_data;
      if (inline?.data) return { model, audio: inline.data, mimeType: inline.mimeType || inline.mime_type || 'audio/L16;rate=24000' };
      last = 'No audio returned';
    } catch (e) { last = e?.message || last; }
  }
  throw new Error(last);
}

// Keep only safe SVG (rendered via <img>, but we clean it anyway).
function safeSvg(svg) {
  svg = String(svg || '');
  const start = svg.indexOf('<svg'), end = svg.lastIndexOf('</svg>');
  if (start < 0 || end < 0) return null;
  svg = svg.slice(start, end + 6);
  if (svg.length > 60000) return null;
  return svg.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, '').replace(/(href\s*=\s*)("|')\s*(?!#)[^"']*\2/gi, '');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  const { task, data = {}, images } = req.body || {};
  try {
    if (task === 'tts') {
      const text = s(data.text, 1200);
      if (!text) return res.status(400).json({ error: 'Missing text' });
      return res.status(200).json(await callTts(apiKey, text));
    }
    if (task === 'local') {
      if (!data.city) return res.status(400).json({ error: 'Missing city' });
      const { model, grounded, sources, result } = await callLocal(apiKey, localPrompt(data));
      const list = (Array.isArray(result?.dates) ? result.dates : []).slice(0, 2).map(x => ({
        title: s(x?.title, 70), desc: s(x?.desc, 180), place: s(x?.place, 80), vibe: s(x?.vibe, 40) || 'Local · Easy',
        time: s(x?.time, 20) || '2 hrs', cost: s(x?.cost, 20) || '—',
        setting: /indoor/i.test(x?.setting) ? 'indoor' : 'outdoor', energy: ['low', 'medium', 'high'].includes(x?.energy) ? x.energy : 'medium',
        tags: (Array.isArray(x?.tags) ? x.tags : []).slice(0, 3).map(t => s(t, 20)).filter(Boolean),
        preflight: (Array.isArray(x?.preflight) ? x.preflight : []).slice(0, 3).map(t => s(t, 120)).filter(Boolean),
        steps: (Array.isArray(x?.steps) ? x.steps : []).slice(0, 6).map(st => ({ text: s(st?.text, 160), time: s(st?.time, 20) || '—' })).filter(st => st.text)
      })).filter(x => x.title && x.desc);
      if (!list.length) return res.status(502).json({ error: 'Gemini did not return local dates' });
      return res.status(200).json({ model, grounded, sources, dates: list });
    }
    const prompt = prompts(task, data);
    if (!prompt) return res.status(400).json({ error: 'Unknown task' });
    const { model, result } = await callText(apiKey, prompt, task === 'story' ? images : null);
    if (task === 'invite') {
      const svg = safeSvg(result?.svg);
      if (!svg) return res.status(502).json({ error: 'Gemini did not return a valid card' });
      return res.status(200).json({ model, svg });
    }
    if (task === 'playlist') {
      const songs = (Array.isArray(result?.songs) ? result.songs : []).slice(0, 10)
        .map(x => ({ title: s(x?.title, 80), artist: s(x?.artist, 80), why: s(x?.why, 90) })).filter(x => x.title);
      if (songs.length < 3) return res.status(502).json({ error: 'Gemini did not return a playlist' });
      return res.status(200).json({ model, title: s(result?.title, 60) || 'Date night', songs });
    }
    const captions = (Array.isArray(result?.captions) ? result.captions : []).slice(0, 4).map(c => s(c, 100));
    if (!result?.story) return res.status(502).json({ error: 'Gemini did not return a story' });
    return res.status(200).json({ model, headline: s(result.headline, 80), story: s(result.story, 900), captions });
  } catch (e) {
    return res.status(502).json({ error: e?.message || 'Gemini request failed' });
  }
}
