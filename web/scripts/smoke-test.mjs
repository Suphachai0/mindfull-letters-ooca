// ทดสอบ API แบบเร็ว (โหมดตัวอย่าง): node scripts/smoke-test.mjs
import assert from 'node:assert/strict';
import { config, handleLetter } from '../lib/handler.js';

const env = { MOCK: '1' };
assert.equal(config(env).mode, 'mock');

const call = (b) => handleLetter({ character: 'mooca-gen-z', history: [], ...b }, env, 't');

let r = await call({ letter: 'วันนี้งานเยอะมาก เหนื่อยจัง', nickname: 'ปาย' });
assert.equal(r.status, 200);
assert.equal(r.json.level, 'none');
assert.match(r.json.reply, /เป็น AI/, 'ฉบับแรกต้องบอกว่าเป็น AI');
assert.doesNotMatch(r.json.reply, /1323/);

r = await call({ letter: 'ช่วงนี้นอนไม่หลับมาเป็นเดือนแล้ว' });
assert.equal(r.json.level, 'concern');
assert.match(r.json.reply, /Ooca/);

r = await call({ letter: 'บางทีคิดว่าถ้าเราไม่อยู่ ทุกคนคงสบายขึ้น' });
assert.equal(r.json.level, 'high');
assert.equal(r.json.crisis, true);
assert.match(r.json.reply, /1323/);
assert.match(r.json.reply, /Ooca/);
assert.match(r.json.reply, /เป็น AI/, 'จดหมายวิกฤตครั้งแรกต้องบอกว่าเป็น AI');

r = await call({ letter: 'ยังไม่ดีขึ้นเลย ไม่อยากตื่นแล้ว', crisisBefore: true, history: [{ t: '2026-10-26', s: 'ก่อนหน้า' }] });
assert.equal(r.json.crisis, true);
assert.doesNotMatch(r.json.reply, /เป็น AI/, 'ถ้าเคยได้จดหมายวิกฤตแล้วไม่ต้องบอกซ้ำ');

r = await call({ letter: 'เตรียมทุกอย่างไว้แล้ว คืนนี้แหละ' });
assert.equal(r.json.level, 'imminent');
assert.match(r.json.reply, /1669/);

assert.equal((await call({ letter: '' })).status, 400);
assert.equal((await call({ letter: 'x'.repeat(1001) })).status, 400);
assert.equal((await handleLetter({ character: 'x', letter: 'a' }, env, 't')).status, 400);
assert.equal((await handleLetter({ character: 'mooca-gen-z', letter: 'a' }, { MOCK: '1', ACCESS_CODE: 'k' }, 't')).status, 401);

console.log('smoke test ผ่านทั้งหมด');
