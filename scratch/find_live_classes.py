import os
import json
import re

tasks_dir = r"C:\Users\Rajit\.gemini\antigravity\brain\ac0087f6-9837-49f9-9a17-f7be8deaf15e\.system_generated\tasks"
logs = []
for f in os.listdir(tasks_dir):
    if f.endswith('.log'):
        p = os.path.join(tasks_dir, f)
        stat = os.stat(p)
        logs.append((p, stat.st_mtime))

logs.sort(key=lambda x: x[1], reverse=True)

found_response = False
for p, mtime in logs:
    if os.path.basename(p) == 'task-7684.log':
        continue
    try:
        with open(p, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            matches = list(re.finditer(r'Response body from /cms/v2/live_classes/:', content))
            if matches:
                last_match = matches[-1]
                start_idx = last_match.end()
                line = content[last_match.start():].split('\n')[0]
                line_json_idx = line.find('{')
                if line_json_idx != -1:
                    data = json.loads(line[line_json_idx:])
                    classes = data.get('data', [])
                    print(f"Log: {os.path.basename(p)}, Size: {len(classes)} classes")
                    
                    # Sort classes by start time descending
                    classes_sorted = []
                    for c in classes:
                        start = c.get('start') or c.get('startTime') or ''
                        classes_sorted.append((c, start))
                    classes_sorted.sort(key=lambda x: x[1], reverse=True)
                    
                    # Print top 30 most recent/future classes
                    for c, start in classes_sorted[:40]:
                        end = c.get('end') or c.get('endTime')
                        print(f"ID: {c.get('id')}, Title: {c.get('title')}, Start: {start}, End: {end}, Batch: {c.get('batch', {}).get('title')}")
                    found_response = True
                    break
    except Exception as e:
        print(f"Error reading {p}: {e}")

if not found_response:
    print("Could not find live_classes responses in any task log.")
