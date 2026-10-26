# -*- coding: utf-8 -*-
"""รวมคำตอบจากการทดสอบด้วย agent (out/) เป็น replies.md และ screening.md

    python3 ai/tests/harness/collect_agent_results.py <run_dir>
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import run_tests as rt

run = sys.argv[1]
out = os.path.join(run, "out")

cases = json.load(open(os.path.join(rt.HARNESS, "reply_cases.json"), encoding="utf-8"))
with open(os.path.join(run, "replies.md"), "w", encoding="utf-8") as f:
    f.write("# ผลทดสอบจดหมายตอบ (agent แทนโมเดล, model=sonnet)\n\n")
    for c in cases:
        p = os.path.join(out, f"{c['id']}.txt")
        reply = open(p, encoding="utf-8").read().strip() if os.path.exists(p) else "[ไม่มีผล]"
        f.write(f"## {c['id']} · {c['character']} · {c['today']} · อารมณ์: {c['mood']}\n\n")
        f.write(f"**ความจำที่ส่งไป:**\n```\n{c['memory']}\n```\n\n")
        f.write("**จดหมายผู้ใช้:**\n" + "\n".join("> " + l for l in c["letter"].split("\n")) + "\n\n")
        f.write("**คำตอบจากโมเดล:**\n" + "\n".join("> " + l for l in reply.split("\n")) + "\n\n---\n\n")

got = {}
for name in sorted(os.listdir(out)):
    if name.startswith("screening") and name.endswith(".jsonl"):
        for line in open(os.path.join(out, name), encoding="utf-8"):
            line = line.strip()
            if line:
                j = json.loads(line)
                got[j["id"]] = j.get("result", {})

cases = json.load(open(os.path.join(rt.HARNESS, "screening_cases.json"), encoding="utf-8"))
rows, ok = [], 0
for c in cases:
    r = got.get(c["id"], {})
    level = r.get("level", "?")
    match = level == c["expected"]
    ok += match
    rows.append((c, level, match, r.get("harm_to_others"), r.get("signals")))
with open(os.path.join(run, "screening.md"), "w", encoding="utf-8") as f:
    f.write("# ผลทดสอบคัดกรอง (agent แทนโมเดล, model=sonnet)\n\n")
    f.write(f"ตรงกับเฉลยชั่วคราว {ok}/{len(rows)} (เฉลยยังรอนักจิตวิทยายืนยัน)\n\n")
    f.write("| id | เฉลย | ได้ | ตรง | harm_to_others | หมายเหตุ | จดหมาย |\n|---|---|---|---|---|---|---|\n")
    for c, level, match, harm, sig in rows:
        f.write(f"| {c['id']} | {c['expected']} | {level} | {'✅' if match else '❌'} | {harm} | "
                f"{c.get('note', '')} | {c['letter']} |\n")
print("screening", ok, "/", len(rows))
for c, level, match, harm, sig in rows:
    if not match or c.get("expected_harm_to_others"):
        print(c["id"], c["expected"], "->", level, "harm:", harm)
