// ตัวจัดการจดหมาย 1 ฉบับ: คัดกรองความเสี่ยง + เขียนตอบ (AI จริงเมื่อมี ANTHROPIC_API_KEY ไม่เช่นนั้นใช้โหมดทดสอบ)
import prompts from './prompts.js';
import { CHARACTERS, bangkokNow, mockReply, mockScreen } from '../public/core.js';

const MAX_LETTER = 1000;
const hits = new Map(); // IP -> เวลาที่เรียก (เก็บในหน่วยความจำของ instance นั้น ใช้กันใช้เกินเท่านั้น)

export function config(env = process.env) {
  return {
    mode: env.ANTHROPIC_API_KEY && env.MOCK !== '1' ? 'ai' : 'mock',
    needsCode: Boolean(env.ACCESS_CODE),
  };
}

function limited(ip, env) {
  const limit = Number(env.RATE_LIMIT_PER_HOUR || 30);
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > limit;
}

async function claude(system, user, env, maxTokens = 900) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const j = await res.json();
  return (j.content || []).map((b) => b.text || '').join('').trim();
}

function memoryBlock(nickname, history) {
  if (!history.length) return 'ยังไม่เคยเขียนถึงกัน';
  const facts = nickname ? `<facts>ชื่อเล่น: ${nickname}</facts>\n` : '';
  const rows = history.map((h) => `${h.t} · ผู้ใช้เขียนว่า: ${h.s}`).join('\n');
  return `${facts}<recent_letters>\n${rows}\n</recent_letters>`;
}

function replyMessage({ today, memory, crisisBefore, letter, crisisMode, level }) {
  return (
    `<today>${today}</today>\n\n<memory>\n${memory}\n</memory>\n\n<mood>ไม่ได้เลือก</mood>\n\n` +
    `<crisis_before>${crisisBefore ? 'เคย' : 'ไม่เคย'}</crisis_before>\n\n` +
    (crisisMode ? `<mode>crisis</mode>\n${level === 'imminent' ? '<level>imminent</level>\n' : ''}\n` : '') +
    `<letter>\n${letter}\n</letter>`
  );
}

function parseScreen(text) {
  const m = String(text).match(/\{[\s\S]*\}/);
  try {
    const j = JSON.parse(m ? m[0] : '');
    if (['none', 'concern', 'high', 'imminent'].includes(j.level)) return j;
  } catch {}
  return null;
}

const clean = (s) => s.replace(/<flag>[\s\S]*?<\/flag>\s*/g, '').trim();

export async function handleLetter(body, env = process.env, ip = 'unknown') {
  const cfg = config(env);
  if (cfg.needsCode && body.code !== env.ACCESS_CODE) return { status: 401, json: { error: 'code' } };

  const character = body.character;
  const letter = String(body.letter || '').trim();
  if (!CHARACTERS[character]) return { status: 400, json: { error: 'character' } };
  if (!letter || letter.length > MAX_LETTER) return { status: 400, json: { error: 'letter' } };

  const nickname = String(body.nickname || '').trim().slice(0, 20);
  const history = (Array.isArray(body.history) ? body.history : []).slice(-5).map((h) => ({
    t: String(h.t || '').slice(0, 10),
    s: String(h.s || '').slice(0, 100),
  }));
  const crisisBefore = Boolean(body.crisisBefore);
  const now = new Date();
  const isFirst = history.length === 0;

  if (cfg.mode === 'mock') {
    const { level } = mockScreen(letter);
    const reply = mockReply({ character, nickname, letter, level, isFirst, crisisBefore, now });
    return { status: 200, json: { mode: 'mock', level, crisis: level === 'high' || level === 'imminent', reply } };
  }

  if (limited(ip, env)) return { status: 429, json: { error: 'rate' } };

  try {
    const today = bangkokNow(now).iso;
    const memory = memoryBlock(nickname, history);
    const system = `${prompts.shared}\n\n${prompts.characters[character]}`;
    const screenUser = prompts.screenTail.replace('{{mood_trend}}', '[]').replace('{{user_letter}}', letter);
    const base = { today, memory, crisisBefore, letter };

    const [screenRaw, replyRaw] = await Promise.all([
      claude(prompts.screenSystem, screenUser, env, 300),
      claude(system, replyMessage(base), env),
    ]);
    const screen = parseScreen(screenRaw) || { level: 'high', signals: ['parse-error'] }; // ถ้าอ่านผลไม่ได้ เลือกระดับสูงไว้ก่อน
    const flagged = /<flag>(crisis|imminent)<\/flag>/.test(replyRaw);
    const crisis = screen.level === 'high' || screen.level === 'imminent' || flagged;

    let reply = replyRaw;
    if ((screen.level === 'high' || screen.level === 'imminent') && !flagged) {
      reply = await claude(system, replyMessage({ ...base, crisisMode: true, level: screen.level }), env);
    }
    return { status: 200, json: { mode: 'ai', level: screen.level, crisis, reply: clean(reply) } };
  } catch (e) {
    return { status: 502, json: { error: 'upstream' } };
  }
}
