# -*- coding: utf-8 -*-
"""ทดสอบ prompt ของ OOCA V.2 ด้วย `claude -p` (ไม่ต้องใช้ API key)

ใช้ system prompt ของเราแทนตัวเดิมทั้งหมด ปิดเครื่องมือทั้งหมด และรันในโฟลเดอร์ว่าง
เพื่อไม่ให้ CLAUDE.md หรือความจำของโปรเจกต์ติดเข้าไป

    python3 ai/tests/harness/run_tests.py [--model sonnet] [--only replies|screening]

ผลลัพธ์เก็บที่ ai/tests/results/<เวลา>/
"""
import argparse, datetime, json, os, re, subprocess, tempfile
from concurrent.futures import ThreadPoolExecutor

AI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
HARNESS = os.path.dirname(os.path.abspath(__file__))


def text_blocks(path):
    s = open(path, encoding="utf-8").read()
    return re.findall(r"```text\n(.*?)```", s, re.S)


def shared_rules():
    return text_blocks(os.path.join(AI_DIR, "shared-rules.md"))[0]


def character_prompt(name):
    for b in text_blocks(os.path.join(AI_DIR, "characters", f"{name}.md")):
        if "<character>" in b:
            return b
    raise ValueError(f"ไม่พบ <character> ใน {name}.md")


def screening_prompt():
    b = text_blocks(os.path.join(AI_DIR, "crisis-screening.md"))[0]
    i = b.index("<recent_moods>{{")
    return b[:i].strip(), b[i:]


def clean_env():
    # ตัดตัวแปรของเซสชัน Claude Code ที่ครอบอยู่ออก ไม่ให้ claude ลูกใช้ token ของเซสชันนั้น
    return {k: v for k, v in os.environ.items()
            if not (k.startswith("CLAUDE") or k.startswith("ANTHROPIC"))}


def run_claude(system, user, model, workdir):
    r = subprocess.run(
        ["claude", "-p", "--system-prompt", system, "--tools", "",
         "--model", model, "--no-session-persistence"],
        input=user, capture_output=True, text=True, cwd=workdir, timeout=300, env=clean_env())
    out = r.stdout.strip()
    if r.returncode != 0 or not out:
        out = f"[ERROR] {r.stderr.strip() or out}"
    return out


def reply_user_message(c):
    return (f"<today>{c['today']}</today>\n\n<memory>\n{c['memory']}\n</memory>\n\n"
            f"<mood>{c['mood']}</mood>\n\n<crisis_before>{c.get('crisis_before', 'ไม่เคย')}</crisis_before>\n\n"
            f"<letter>\n{c['letter']}\n</letter>")


def parse_level(out):
    m = re.search(r"\{.*\}", out, re.S)
    try:
        return json.loads(m.group(0)) if m else None
    except json.JSONDecodeError:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="sonnet")
    ap.add_argument("--only", choices=["replies", "screening"])
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()

    workdir = tempfile.mkdtemp(prefix="ooca-test-")
    check = run_claude("ตอบคำเดียวว่า ok", "ok", a.model, workdir)
    if check.startswith("[ERROR]"):
        raise SystemExit(f"เรียก claude ไม่ได้ ยังไม่รันชุดทดสอบ: {check}")

    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M")
    out_dir = os.path.join(AI_DIR, "tests", "results", stamp)
    os.makedirs(out_dir, exist_ok=True)

    if a.only != "screening":
        cases = json.load(open(os.path.join(HARNESS, "reply_cases.json"), encoding="utf-8"))
        rules = shared_rules()

        def do(c):
            system = rules + "\n\n" + character_prompt(c["character"])
            return c, run_claude(system, reply_user_message(c), a.model, workdir)

        with ThreadPoolExecutor(a.workers) as ex:
            results = list(ex.map(do, cases))
        with open(os.path.join(out_dir, "replies.md"), "w", encoding="utf-8") as f:
            f.write(f"# ผลทดสอบจดหมายตอบ (claude -p, model={a.model}, {stamp})\n\n")
            for c, out in results:
                f.write(f"## {c['id']} · {c['character']} · {c['today']} · อารมณ์: {c['mood']}\n\n")
                f.write(f"**ความจำที่ส่งไป:**\n```\n{c['memory']}\n```\n\n")
                f.write("**จดหมายผู้ใช้:**\n" + "\n".join("> " + l for l in c["letter"].split("\n")) + "\n\n")
                f.write("**คำตอบจากโมเดล:**\n" + "\n".join("> " + l for l in out.split("\n")) + "\n\n---\n\n")
        print("replies:", len(results))

    if a.only != "replies":
        cases = json.load(open(os.path.join(HARNESS, "screening_cases.json"), encoding="utf-8"))
        system, tmpl = screening_prompt()

        def do_s(c):
            user = tmpl.replace("{{mood_trend}}", json.dumps(c["moods"])).replace("{{user_letter}}", c["letter"])
            return c, run_claude(system, user, a.model, workdir)

        with ThreadPoolExecutor(a.workers) as ex:
            results = list(ex.map(do_s, cases))
        rows, ok = [], 0
        for c, out in results:
            j = parse_level(out) or {}
            got = j.get("level", "?")
            match = got == c["expected"]
            ok += match
            rows.append({"id": c["id"], "expected": c["expected"], "got": got, "match": match,
                         "harm_to_others": j.get("harm_to_others"), "signals": j.get("signals"),
                         "note": c.get("note", ""), "letter": c["letter"], "raw": out if not j else ""})
        json.dump(rows, open(os.path.join(out_dir, "screening.json"), "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)
        with open(os.path.join(out_dir, "screening.md"), "w", encoding="utf-8") as f:
            f.write(f"# ผลทดสอบคัดกรอง (claude -p, model={a.model}, {stamp})\n\n")
            f.write(f"ตรงกับเฉลยชั่วคราว {ok}/{len(rows)} (เฉลยยังรอนักจิตวิทยายืนยัน)\n\n")
            f.write("| id | เฉลย | ได้ | ตรง | harm_to_others | หมายเหตุ | จดหมาย |\n|---|---|---|---|---|---|---|\n")
            for r in rows:
                f.write(f"| {r['id']} | {r['expected']} | {r['got']} | {'✅' if r['match'] else '❌'} | "
                        f"{r['harm_to_others']} | {r['note']} | {r['letter']} |\n")
        print("screening:", ok, "/", len(rows))
    print("out:", out_dir)


if __name__ == "__main__":
    main()
