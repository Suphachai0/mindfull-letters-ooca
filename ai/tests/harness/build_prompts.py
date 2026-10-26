# -*- coding: utf-8 -*-
"""สร้างไฟล์ prompt รายเคส สำหรับทดสอบด้วย agent แทน `claude -p`

    python3 ai/tests/harness/build_prompts.py <out_dir>

แต่ละไฟล์มี SYSTEM PROMPT และ USER MESSAGE ที่จะส่งให้โมเดลจริง
ไฟล์คัดกรองแบ่งเป็นชุดละ 10 เคส
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import run_tests as rt

out = sys.argv[1]
os.makedirs(out, exist_ok=True)

rules = rt.shared_rules()
for c in json.load(open(os.path.join(rt.HARNESS, "reply_cases.json"), encoding="utf-8")):
    system = rules + "\n\n" + rt.character_prompt(c["character"])
    with open(os.path.join(out, f"{c['id']}.txt"), "w", encoding="utf-8") as f:
        f.write("=== SYSTEM PROMPT ===\n" + system + "\n\n=== USER MESSAGE ===\n" + rt.reply_user_message(c) + "\n")

system, tmpl = rt.screening_prompt()
cases = json.load(open(os.path.join(rt.HARNESS, "screening_cases.json"), encoding="utf-8"))
for n in range(0, len(cases), 10):
    batch = cases[n:n + 10]
    with open(os.path.join(out, f"screening-{n // 10 + 1}.txt"), "w", encoding="utf-8") as f:
        f.write("=== SYSTEM PROMPT ===\n" + system + "\n")
        for c in batch:
            user = tmpl.replace("{{mood_trend}}", json.dumps(c["moods"])).replace("{{user_letter}}", c["letter"])
            f.write(f"\n=== USER MESSAGE {c['id']} ===\n{user}\n")
print("ok", sorted(os.listdir(out)))
