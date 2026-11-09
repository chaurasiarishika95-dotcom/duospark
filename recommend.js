// Gemini-powered date recommendations for DuoSpark.
// Picks 3 dates for a couple from a shortlist (taken from the DuoSpark date library)
// and explains why each one fits this couple.
const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];

function buildPrompt(body) {
  const { me, partner, mode, cities, candidates } = body;
  return `You are DuoSpark's date planner for Indian couples.
Pick exactly 3 date ideas for this couple from the CANDIDATES list only. Use their profiles.
Rules:
- Only use keys from CANDIDATES. Never invent a date.
- Pick 3 different kinds of dates (do not pick 3 similar ones).
- Respect budget and diet. Prefer what BOTH partners would enjoy.
- For each pick, write one warm, specific reason (max 22 words) that mentions something from their profiles. Address them as "you two".
- Also write a one-line intro for the deck (max 16 words).
Return JSON only: {"intro": "...", "picks": [{"key": "...", "reason": "..."}]}

COUPLE: mode=${mode}; cities=${JSON.stringify(cities)}
PARTNER A profile: ${JSON.stringify(me)}
PARTNER B profile: ${JSON.stringify(partner)}
CANDIDATES: ${JSON.stringify(candidates)}`;
}

function clean(result, candidates) {
  const allowed = new Set(candidates.map(c => c.key));
  const seen = new Set();
  const picks = (Array.isArray(result?.picks) ? result.picks : [])
    .filter(p => p && allowed.has(p.key) && !seen.has(p.key) && seen.add(p.key))
    .map(p => ({ key: p.key, reason: String(p.reason || '').slice(0, 200) }))
    .slice(0, 3);
  return { intro: String(result?.intro || '').slice(0, 140), picks };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  const body = req.body || {};
  const candidates = Array.isArray(body.candidates) ? body.candidates.slice(0, 15) : [];
  if (candidates.length < 3) return res.status(400).json({ error: 'Need at least 3 candidates' });
  const prompt = buildPrompt({ ...body, candidates });
  let lastError = 'Gemini request failed';
  for (const model of MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, responseMimeType: 'application/json' } })
      });
      const data = await r.json();
      if (!r.ok) { lastError = data?.error?.message || lastError; continue; }
      const raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
      const parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/, ''));
      const out = clean(parsed, candidates);
      if (out.picks.length === 3) return res.status(200).json({ ...out, model });
      lastError = 'Gemini did not return 3 valid picks';
    } catch (e) { lastError = e?.message || lastError; }
  }
  return res.status(502).json({ error: lastError });
}
