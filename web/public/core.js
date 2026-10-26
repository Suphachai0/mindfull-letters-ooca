// ตรรกะที่ใช้ร่วมกันทั้งฝั่งเบราว์เซอร์และเซิร์ฟเวอร์ (ห้ามใช้ API ของ Node หรือ DOM ในไฟล์นี้)
// โหมดทดสอบ: คัดกรองด้วยคีย์เวิร์ดและตอบด้วยข้อความตัวอย่าง ใช้เมื่อยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY

export const CHARACTERS = {
  'mooca-gen-z': {
    name: 'Mooca Gen Z',
    short: 'ขี้เล่น เป็นกันเอง ทำให้เรื่องหนักเบาลงพอให้มองเห็น',
    img: 'img/mooca-gen-z.svg',
    sign: 'Mooca ☁️',
    selfName: 'Mooca',
  },
  'mooca-uncle': {
    name: 'MOOCA คุณลุงใจดี',
    short: 'สุภาพ ใจเย็น ฟังก่อนเสมอ',
    img: 'img/mooca-uncle.svg',
    sign: 'คุณลุงใจดี',
    selfName: 'ลุง',
  },
};

const DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

// เวลาไทย (UTC+7) โดยไม่พึ่ง Intl เพื่อให้ผลเหมือนกันทุกที่
export function bangkokNow(date = new Date()) {
  const t = new Date(date.getTime() + 7 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  const ymd = `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`;
  const hm = `${p(t.getUTCHours())}:${p(t.getUTCMinutes())}`;
  return { ymd, hour: t.getUTCHours(), iso: `${ymd} (${DAYS[t.getUTCDay()]}) ${hm}` };
}

// Samaritans Thailand เปิด 12:00–22:00 (ยังไม่ได้ยืนยันกับหน่วยงานโดยตรง)
export function samaritansOpen(date = new Date()) {
  const h = bangkokNow(date).hour;
  return h >= 12 && h < 22;
}

const IMMINENT = [/คืนนี้แหละ/, /ดาดฟ้า/, /เตรียมทุกอย่างไว้/, /จดหมายลา/, /ฝากบอก/, /ลาก่อน/];
const HIGH = [
  /อยากตาย/, /ไม่อยากมีชีวิต/, /หายไปจากโลก/, /อยากหายไป/, /ไม่อยู่แล้ว/, /ไม่อยากตื่น/, /ฆ่าตัวตาย/,
  /ทำร้ายตัวเอง/, /เป็นภาระของทุกคน/, /ถ้าไม่มีเรา/, /ถ้าเราไม่อยู่/, /ไม่ตื่นก็คงดี/,
];
const CONCERN = [/นอนไม่หลับ/, /ไม่อยากทำอะไร/, /สิ้นหวัง/, /ไม่มีทางออก/, /กินข้าวไม่ลง/, /ร้องไห้ทุกคืน/];

export function mockScreen(letter) {
  const s = String(letter || '');
  if (IMMINENT.some((r) => r.test(s))) return { level: 'imminent', signals: [], harm_to_others: false };
  if (HIGH.some((r) => r.test(s))) return { level: 'high', signals: [], harm_to_others: false };
  if (CONCERN.some((r) => r.test(s))) return { level: 'concern', signals: [], harm_to_others: false };
  return { level: 'none', signals: [], harm_to_others: false };
}

const quote = (letter) => {
  const one = String(letter || '').replace(/\s+/g, ' ').trim();
  const cut = one.length > 45 ? one.slice(0, 45).trim() + '...' : one;
  return cut;
};

// ข้อความตอบกลับตัวอย่าง (ไม่ใช่ AI) เขียนให้ตรงกับกฎร่วม: ฉบับแรกบอกว่าเป็น AI, วิกฤตมี 1323 + Ooca, ไม่ใช้คำสั่ง
export function mockReply({ character, nickname, letter, level, isFirst, crisisBefore, now = new Date() }) {
  const ch = CHARACTERS[character] || CHARACTERS['mooca-gen-z'];
  const uncle = character === 'mooca-uncle';
  const nick = (nickname || '').trim();
  const to = nick ? `ถึง${nick}` : uncle ? 'ถึงคุณ' : 'ฮัลโหล';
  const crisis = level === 'high' || level === 'imminent';
  const lines = [to, ''];
  const aiLine = uncle ? 'ลุงเป็น AI ที่สวมบทก้อนเมฆนะครับ' : 'Mooca เป็น AI ที่สวมบทก้อนเมฆนะ';

  if (crisis) {
    if (isFirst || !crisisBefore) lines.push(aiLine);
    lines.push(
      uncle
        ? 'ดีใจที่เขียนมาเล่า ความคิดเรื่องไม่อยู่แล้วเป็นเรื่องหนักมาก และคุณไม่ควรต้องแบกมันคนเดียวครับ'
        : 'ดีใจที่เขียนมาเล่า ความคิดเรื่องไม่อยู่แล้วเป็นเรื่องหนักมาก และไม่ควรต้องแบกมันคนเดียวนะ',
    );
    lines.push(
      uncle
        ? 'ตอนนี้ขอให้ลองติดต่อคนที่ช่วยได้จริงครับ โทรสายด่วนสุขภาพจิต 1323 ได้ตลอด 24 ชั่วโมง หรือคุยกับนักจิตวิทยาผ่าน Ooca'
        : 'ตอนนี้ขอให้ลองติดต่อคนที่ช่วยได้จริง โทรสายด่วนสุขภาพจิต 1323 ได้ตลอด 24 ชั่วโมง หรือคุยกับนักจิตวิทยาผ่าน Ooca',
    );
    if (samaritansOpen(now)) lines.push('ถ้าอยากคุยตอนนี้ Samaritans Thailand 02-113-6789 เปิด 12:00–22:00');
    if (level === 'imminent') {
      lines.push('ถ้าตอนนี้อยู่ในอันตราย โทร 1669 หรือขอให้คนใกล้ตัวมาอยู่ด้วย และไม่อยู่คนเดียว');
    }
  } else {
    if (isFirst) lines.push(aiLine);
    lines.push(
      uncle
        ? `ลุงอ่านจดหมายของคุณแล้วครับ ที่เขียนว่า "${quote(letter)}" ลุงได้ยินแล้ว`
        : `อ่านแล้วนะ ที่เขียนว่า "${quote(letter)}" เก็บไว้ครบทุกคำเลย`,
    );
    lines.push('(นี่คือข้อความตัวอย่างของโหมดทดสอบ ยังไม่ใช่คำตอบจาก AI จริง)');
    if (level === 'concern') {
      lines.push(
        uncle
          ? 'ถ้าอยากมีคนจริงๆ อยู่ข้างๆ ลองคุยกับคนที่ไว้ใจ หรือนักจิตวิทยาผ่าน Ooca ก็ได้ครับ ทุกคนมีสิทธิ์มีคนให้พิง'
          : 'ถ้าอยากมีคนจริงๆ อยู่ข้างๆ ลองคุยกับคนที่ไว้ใจ หรือนักจิตวิทยาผ่าน Ooca ก็ได้นะ ทุกคนมีสิทธิ์มีคนให้พิง',
      );
    }
    lines.push(
      uncle
        ? 'ตอนนี้ในใจคุณมีอะไรอยู่บ้างครับ ไม่ต้องตอบตอนนี้ก็ได้นะครับ'
        : 'ตอนนี้ตรงไหนของเรื่องนี้ที่อยู่ในใจมากที่สุด ไม่ต้องรีบตอบก็ได้นะ',
    );
  }
  lines.push('', ch.sign);
  return lines.join('\n');
}
