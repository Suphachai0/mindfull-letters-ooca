import { CHARACTERS, bangkokNow, mockReply, mockScreen, samaritansOpen } from './core.js';

const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem('ooca_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ooca_' + k, JSON.stringify(v)); } catch {} },
  clear() { try { Object.keys(localStorage).filter((k) => k.startsWith('ooca_')).forEach((k) => localStorage.removeItem(k)); } catch {} },
};

const state = { cfg: { mode: 'mock', needsCode: false, local: false }, character: null, pending: null, current: null, viewId: null };
const SCREENS = ['ob1', 'ob2', 'ob3', 'disclaimer', 'write', 'choose', 'send', 'help', 'read', 'error', 'drawer', 'view'];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const WIDE = ['ob1', 'ob2', 'ob3', 'disclaimer', 'choose'];
function show(name) {
  if (WIDE.includes(name)) $('app').dataset.wide = ''; else delete $('app').dataset.wide;
  SCREENS.forEach((s) => ($('s-' + s).hidden = s !== name));
  const h = $('s-' + name).querySelector('h1');
  if (h) h.focus({ preventScroll: true });
  scrollTo(0, 0);
}

/* ---------- ซองจดหมาย (ใช้ซ้ำหลายหน้า) ---------- */
const envHtml = (img) => `<div class="envelope-art"><svg viewBox="0 0 279 212" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="16" width="277" height="180" rx="12" fill="#fff" stroke="#CDD8E1" stroke-width="2"/><path d="M3 24 L139.5 112 L276 24" fill="#F6F6F6" stroke="#CDD8E1" stroke-width="2" stroke-linejoin="round"/><path d="M3 194 L100 120 M276 194 L179 120" stroke="#E4E9EE" stroke-width="2" fill="none"/></svg><div class="seal"><img src="${img}" alt=""></div></div>`;
document.querySelectorAll('[data-env]').forEach((el) => { el.innerHTML = envHtml(CHARACTERS[el.dataset.env].img); });

/* ---------- ตั้งค่าและโหมด ---------- */
async function loadConfig() {
  try {
    const r = await fetch('api/config', { cache: 'no-store' });
    if (!r.ok) throw new Error();
    state.cfg = { ...(await r.json()), local: false };
  } catch {
    state.cfg = { mode: 'mock', needsCode: false, local: true }; // โฮสต์แบบ static ไม่มี API: ทำงานฝั่งเบราว์เซอร์
  }
  const b = $('mode-badge');
  b.hidden = false;
  b.textContent = state.cfg.mode === 'ai' ? 'โหมด: AI จริง' : 'โหมด: ข้อความตัวอย่าง (ไม่ใช่ AI)';
  $('code-field').hidden = !state.cfg.needsCode;
}

/* ---------- onboarding / disclaimer ---------- */
const MAX = 1000;
const goWrite = () => { updateCount(); show('write'); };
document.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => show(b.dataset.go)));
$('nick').value = store.get('nick', '');
$('agree').onchange = () => {
  $('btn-agree').disabled = !$('agree').checked;
  $('agree-hint').hidden = $('agree').checked;
};
$('btn-agree').onclick = () => {
  store.set('consent', true);
  store.set('nick', $('nick').value.trim().slice(0, 20));
  if (state.cfg.needsCode) sessionStorage.setItem('ooca_code', $('code').value);
  goWrite();
};

/* ---------- เขียน ---------- */
const updateCount = () => {
  const v = $('letter').value;
  $('count').textContent = v.length.toLocaleString('en-US');
  $('btn-fold').disabled = v.trim().length === 0;
  const full = v.length >= MAX;
  $('limit-note').hidden = !full;
  $('count-wrap').classList.toggle('full', full);
};
$('letter').addEventListener('input', updateCount);
document.querySelectorAll('.chip').forEach((c) => (c.onclick = () => {
  const t = $('letter');
  t.value = ((t.value ? t.value + '\n' : '') + c.dataset.t + '\n').slice(0, MAX);
  t.focus();
  updateCount();
}));
$('btn-fold').onclick = () => { renderCards(); show('choose'); };
$('btn-back-write').onclick = () => show('write');
$('btn-back-write-2').onclick = goWrite;

const modal = $('modal');
const openModal = () => { modal.hidden = false; $('btn-stay').focus(); };
const closeModal = () => { modal.hidden = true; };
$('btn-back-write-top').onclick = () => {
  if ($('letter').value.trim()) openModal(); else show('ob1');
};
$('btn-stay').onclick = () => { closeModal(); $('letter').focus(); };
$('btn-leave').onclick = () => { closeModal(); $('letter').value = ''; updateCount(); show('ob1'); };
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) $('btn-stay').click(); });

/* ---------- แปะสติ๊กเกอร์ (ลากหรือแตะการ์ด) ---------- */
const DESC = {
  'mooca-uncle': 'คุณลุงใจดีที่สุภาพและใจเย็น ฟังก่อนเสมอ และมีอีกมุมมองไว้ถ้าคุณอยากฟัง',
  'mooca-gen-z': 'เพื่อนวัยเดียวกันที่เป็นกันเอง ขี้เล่นในวันที่เรื่องเบา และพูดช้าลงนุ่มลงในวันที่เรื่องหนัก ฟังก่อนเสมอ',
};
const TICK = '<svg class="tick" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 12.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function place(id) {
  state.character = id;
  const c = CHARACTERS[id];
  document.querySelectorAll('.card-choice').forEach((l) => {
    const on = l.dataset.id === id;
    l.classList.toggle('on', on);
    l.classList.toggle('faded', on);
    l.querySelector('input').checked = on;
  });
  const drop = $('drop');
  drop.classList.add('filled');
  $('drop-img').src = c.img;
  $('drop-img').hidden = false;
  $('envelope').classList.remove('done');
  void $('envelope').offsetWidth;
  $('envelope').classList.add('done');
  $('to-who').hidden = false;
  $('to-who').textContent = `จดหมายฉบับนี้จะส่งถึง ${c.name}`;
  $('btn-send').disabled = false;
  $('send-hint').hidden = true;
}

function renderCards() {
  const wrap = $('cards');
  wrap.innerHTML = '';
  state.character = null;
  $('drop').classList.remove('filled');
  $('drop-img').hidden = true;
  $('envelope').classList.remove('done');
  $('to-who').hidden = true;
  $('btn-send').disabled = true;
  $('send-hint').hidden = false;
  ['mooca-uncle', 'mooca-gen-z'].forEach((id) => {
    const c = CHARACTERS[id];
    const label = document.createElement('label');
    label.className = 'card-choice';
    label.dataset.id = id;
    label.innerHTML = `<input type="radio" name="ch" value="${id}"><img src="${c.img}" alt="" draggable="false"><span><span class="name">${c.name}</span><span class="desc">${DESC[id]}</span></span>${TICK}`;
    label.querySelector('input').onchange = () => place(id);
    wrap.appendChild(label);
    enableDrag(label.querySelector('img'), id);
  });
}

function enableDrag(img, id) {
  img.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    e.preventDefault();
    const ghost = document.createElement('img');
    ghost.src = img.src; ghost.className = 'ghost'; ghost.alt = '';
    document.body.appendChild(ghost);
    const mv = (ev) => {
      ghost.style.left = ev.clientX + 'px';
      ghost.style.top = ev.clientY + 'px';
      $('drop').classList.toggle('over', inDrop(ev));
    };
    const up = (ev) => {
      removeEventListener('pointermove', mv);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      ghost.remove();
      $('drop').classList.remove('over');
      if (ev.type === 'pointerup' && inDrop(ev)) place(id);
    };
    mv(e);
    addEventListener('pointermove', mv);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  });
}
function inDrop(ev) {
  const r = $('envelope').getBoundingClientRect();
  return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
}

/* ---------- ส่งจดหมาย ---------- */
const STAGES = [
  ['close', 'กำลังปิดซอง', 1500],
  ['drop', 'หย่อนจดหมายลงตู้ไปรษณีย์', 1500],
  ['pickup', 'จดหมายของคุณกำลังเดินทาง', 2800],
  ['wait', 'จดหมายตอบกำลังเตรียมอยู่', 3000],
];
const STAGES_AFTER = [
  ['deliver', 'จดหมายตอบมาถึงแล้ว', 2400],
  ['open', 'เปิดซองได้เลย', 2000],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function history(character) {
  return store.get('letters', []).filter((l) => l.character === character).slice(-5)
    .map((l) => ({ t: l.date, s: l.letter.replace(/\s+/g, ' ').slice(0, 100) }));
}

async function request(p) {
  const local = () => {
    const { level } = mockScreen(p.letter);
    const reply = mockReply({ character: p.character, nickname: p.nickname, letter: p.letter, level,
      isFirst: p.history.length === 0, crisisBefore: p.crisisBefore });
    return { ok: true, data: { mode: 'mock', level, crisis: level === 'high' || level === 'imminent', reply } };
  };
  if (state.cfg.local) return local();
  try {
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 40000);
    const r = await fetch('api/letter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(p), signal: ctl.signal });
    clearTimeout(to);
    if (r.ok) return { ok: true, data: await r.json() };
    if (r.status === 404 || r.status === 405) return local();
    return { ok: false, status: r.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function send() {
  const letter = $('letter').value.trim();
  const character = state.character;
  const payload = {
    character, letter, nickname: store.get('nick', ''), history: history(character),
    crisisBefore: Boolean(store.get('crisis', {})[character]), code: sessionStorage.getItem('ooca_code') || '',
  };
  state.pending = payload;
  $('send-env').innerHTML = envHtml(CHARACTERS[character].img);
  $('wait-char').src = CHARACTERS[character].img;
  show('send');
  let skip = false;
  const seen = store.get('seen', false);
  const skipBtn = $('btn-skip');
  skipBtn.hidden = !seen;
  skipBtn.classList.remove('faint');
  const showSkip = seen ? null : setTimeout(() => { skipBtn.hidden = false; skipBtn.classList.add('faint'); }, 3000);
  skipBtn.onclick = () => { skip = true; };
  const req = request(payload);

  const run = async (list) => {
    for (const [stage, text, ms] of list) {
      $('scene').dataset.stage = stage;
      $('stage-text').textContent = text;
      const end = Date.now() + (reduced ? Math.min(ms, 600) : ms);
      while (Date.now() < end && !skip) await sleep(100);
    }
  };
  await run(STAGES);
  let result = await Promise.race([req, sleep(50).then(() => null)]);
  if (!result) {
    $('scene').dataset.stage = 'wait2';
    $('stage-text').textContent = 'ใช้เวลานานกว่าปกติเล็กน้อย ไม่ต้องรีบนะ จดหมายของคุณยังอยู่ครบ';
    result = await req;
    await sleep(300);
  }
  clearTimeout(showSkip);
  if (!result.ok) return fail(result.status);
  await run(STAGES_AFTER);
  finish(result.data, payload);
}

function fail(status) {
  const msg = status === 401 ? 'รหัสเข้าใช้งานไม่ถูกต้อง กลับไปหน้าแรกเพื่อใส่รหัสใหม่'
    : status === 429 ? 'วันนี้เว็บทดสอบถูกใช้เยอะแล้ว ลองใหม่ภายหลังได้ จดหมายของคุณยังอยู่กับเรา'
    : 'จดหมายของคุณยังอยู่กับเรา ลองส่งอีกครั้งได้เลย';
  $('error-text').textContent = msg;
  show('error');
}

function finish(data, p) {
  const rec = { id: Date.now().toString(36), date: bangkokNow().ymd, character: p.character, letter: p.letter,
    reply: data.reply, level: data.level, crisis: Boolean(data.crisis), mode: data.mode };
  store.set('letters', [...store.get('letters', []), rec]);
  store.set('seen', true);
  if (data.crisis) store.set('crisis', { ...store.get('crisis', {}), [p.character]: true });
  $('letter').value = '';
  state.current = rec;
  if (data.crisis) showHelp(rec.level); else showRead(rec);
}

$('btn-send').onclick = send;
$('btn-retry').onclick = () => {
  if (state.pending) send(); else show('write');
};

/* ---------- หน้าช่วยเหลือ ---------- */
function showHelp(level) {
  const rows = [
    ['สายด่วนสุขภาพจิต กรมสุขภาพจิต', '1323', 'ฟรี 24 ชั่วโมง'],
  ];
  if (samaritansOpen()) rows.push(['Samaritans Thailand', '02-113-6789', 'เปิด 12:00–22:00 ทุกวัน']);
  const ul = $('channels');
  ul.innerHTML = '';
  rows.forEach(([nm, tel, note]) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="nm">${nm}</span><a class="tel" href="tel:${tel.replace(/-/g, '')}">${tel}</a><small>${note}</small>`;
    ul.appendChild(li);
  });
  const ooca = document.createElement('li');
  ooca.innerHTML = '<span class="nm">คุยกับนักจิตวิทยาผ่านแอป Ooca</span><small>สำหรับคนที่อยากคุยต่อเนื่อง</small>';
  ul.appendChild(ooca);
  $('urgent').hidden = level !== 'imminent';
  show('help');
}
$('btn-read-after-help').onclick = () => showRead(state.current);

/* ---------- อ่านจดหมายตอบ ---------- */
let typer = null;
function showRead(rec) {
  const ch = CHARACTERS[rec.character];
  $('read-sticker').src = ch.img;
  $('read-sticker').alt = ch.name;
  $('read-from').textContent = `จาก ${ch.name}`;
  $('reply-sr').textContent = rec.reply;
  $('mock-note').hidden = rec.mode !== 'mock';
  const out = $('reply-visible');
  out.textContent = '';
  show('read');
  clearInterval(typer);
  const chars = [...rec.reply];
  let i = 0;
  if (reduced) { out.textContent = rec.reply; return; }
  typer = setInterval(() => {
    i += 2;
    out.textContent = chars.slice(0, i).join('');
    if (i >= chars.length) clearInterval(typer);
  }, 40);
  $('btn-show-all').onclick = () => { clearInterval(typer); out.textContent = rec.reply; };
}
$('btn-write-again').onclick = () => { $('letter').value = ''; goWrite(); };

/* ---------- ลิ้นชัก ---------- */
function showDrawer() {
  const list = $('drawer-list');
  const letters = store.get('letters', []).slice().reverse();
  list.innerHTML = '';
  $('drawer-empty').hidden = letters.length > 0;
  letters.forEach((l) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    const ch = CHARACTERS[l.character];
    b.innerHTML = `<img src="${ch.img}" alt=""><span><span class="when"></span><span class="snip" style="display:block"></span></span>`;
    b.querySelector('.when').textContent = `${l.date} · ${ch.name}`;
    b.querySelector('.snip').textContent = l.letter;
    b.onclick = () => showView(l.id);
    li.appendChild(b);
    list.appendChild(li);
  });
  show('drawer');
}
function showView(id) {
  const l = store.get('letters', []).find((x) => x.id === id);
  if (!l) return showDrawer();
  state.viewId = id;
  $('view-letter').textContent = l.letter;
  $('view-reply').textContent = l.reply;
  show('view');
}
['btn-drawer-2', 'btn-drawer-3'].forEach((id) => ($(id).onclick = showDrawer));
$('btn-view-back').onclick = showDrawer;
$('btn-view-delete').onclick = () => {
  if (!confirm('ลบจดหมายฉบับนี้ออกจากเครื่องนี้ใช่ไหม')) return;
  store.set('letters', store.get('letters', []).filter((x) => x.id !== state.viewId));
  showDrawer();
};
$('btn-write-from-drawer').onclick = () => { $('letter').value = ''; goWrite(); };
$('btn-forget').onclick = () => {
  if (!confirm('ลบจดหมาย ชื่อเล่น และข้อมูลทั้งหมดในเครื่องนี้ใช่ไหม')) return;
  store.clear();
  $('nick').value = '';
  $('letter').value = '';
  $('agree').checked = false;
  $('agree').onchange();
  show('ob1');
};

loadConfig().then(() => show(store.get('consent', false) ? 'write' : 'ob1'));
