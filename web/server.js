// เซิร์ฟเวอร์สำหรับรันในเครื่อง: node server.js (ตั้ง PORT ได้) ใช้ handler เดียวกับบน Vercel
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config, handleLetter } from './lib/handler.js';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'public');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };

const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', 'x-robots-tag': 'noindex' });
  res.end(body);
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/config') return send(res, 200, JSON.stringify(config(process.env)));
  if (url.pathname === '/api/letter' && req.method === 'POST') {
    let raw = '';
    for await (const c of req) {
      raw += c;
      if (raw.length > 20000) return send(res, 413, '{"error":"size"}');
    }
    let body = {};
    try { body = JSON.parse(raw); } catch { return send(res, 400, '{"error":"json"}'); }
    const { status, json } = await handleLetter(body, process.env, req.socket.remoteAddress);
    return send(res, status, JSON.stringify(json));
  }
  const rel = normalize(url.pathname === '/' ? '/index.html' : url.pathname).replace(/^(\.\.[/\\])+/, '');
  try {
    const data = await readFile(join(root, rel));
    send(res, 200, data, types[extname(rel)] || 'application/octet-stream');
  } catch {
    send(res, 404, 'not found', 'text/plain; charset=utf-8');
  }
}).listen(Number(process.env.PORT || 3000), () => console.log(`http://localhost:${process.env.PORT || 3000}`));
