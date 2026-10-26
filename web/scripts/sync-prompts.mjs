// ดึง prompt จากไฟล์ใน ../ai/ มาสร้าง lib/prompts.js (รันใหม่ทุกครั้งที่แก้ prompt)
//   node scripts/sync-prompts.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'ai');
const read = (p) => readFileSync(join(root, p), 'utf8');
const textBlocks = (s) => [...s.matchAll(/```text\n([\s\S]*?)```/g)].map((m) => m[1]);

const shared = textBlocks(read('shared-rules.md'))[0].trim();
const character = (file) => {
  const b = textBlocks(read(`characters/${file}`)).find((x) => x.includes('<character>'));
  if (!b) throw new Error(`ไม่พบ <character> ใน ${file}`);
  return b.trim();
};

const screenBlock = textBlocks(read('crisis-screening.md'))[0];
const cut = screenBlock.indexOf('<recent_moods>{{');
const screenSystem = screenBlock.slice(0, cut).trim();
const screenTail = screenBlock.slice(cut).trim();

const out = {
  shared,
  screenSystem,
  screenTail,
  characters: {
    'mooca-gen-z': character('mooca-gen-z.md'),
    'mooca-uncle': character('mooca-uncle.md'),
  },
};

writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'prompts.js'),
  `// สร้างอัตโนมัติจาก ../ai/*.md ด้วย scripts/sync-prompts.mjs ห้ามแก้ตรงนี้\nexport default ${JSON.stringify(out, null, 2)};\n`,
);
console.log('ok', Object.fromEntries(Object.entries(out.characters).map(([k, v]) => [k, v.length])), shared.length);
