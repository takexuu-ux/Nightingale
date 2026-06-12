import os
import re

tasks_dir = r"C:\Users\Rajit\.gemini\antigravity\brain\ac0087f6-9837-49f9-9a17-f7be8deaf15e\.system_generated\tasks"
for f in os.listdir(tasks_dir):
    if f.endswith('.log'):
        p = os.path.join(tasks_dir, f)
        try:
            with open(p, 'r', encoding='utf-8', errors='ignore') as logf:
                content = logf.read()
                matches = list(re.finditer(r'zoom_meet_id', content))
                if matches:
                    print(f"Found zoom_meet_id in log {f}!")
                    # print some surrounding text for matches
                    for m in matches[:3]:
                        start = max(0, m.start() - 100)
                        end = min(len(content), m.end() + 500)
                        print(f"--- MATCH in {f} ---")
                        print(content[start:end])
        except Exception as e:
            pass
