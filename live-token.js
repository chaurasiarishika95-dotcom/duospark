// Gives the browser a short-lived Gemini Live token, so the real API key never leaves the server.
// Gemini Live (real-time voice) is on the Gemini API free tier.
const LIVE_MODELS = (process.env.LIVE_MODEL ? [process.env.LIVE_MODEL] : [])
  .concat(['gemini-3.8-live', 'gemini-2.5-flash-native-audio-preview-12-2025']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  try {
    const now = Date.now();
    const r = await fetch(`https://generativelanguage.googleapis.com/v1alpha/auth_tokens?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uses: 3, // a few tries, in case the first model name isn't available
        expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 2 * 60 * 1000).toISOString()
      })
    });
    const data = await r.json();
    if (!r.ok || !data?.name) return res.status(502).json({ error: data?.error?.message || 'Could not create a Live token' });
    return res.status(200).json({ token: data.name, models: [...new Set(LIVE_MODELS)] });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
