import { handleLetter } from '../lib/handler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method' });
    return;
  }
  let body = req.body;
  try {
    if (typeof body === 'string') body = JSON.parse(body);
  } catch {
    res.status(400).json({ error: 'json' });
    return;
  }
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const { status, json } = await handleLetter(body || {}, process.env, ip);
  res.setHeader('cache-control', 'no-store');
  res.status(status).json(json);
}
