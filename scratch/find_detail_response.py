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

# Sort by modification time descending
logs.sort(key=lambda x: x[1], reverse=True)

found_response = False
for p, mtime in logs:
    if os.path.basename(p) == 'task-7684.log':
        continue
    try:
        with open(p, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            # Find occurrences of "/cms/v2/live_classes/[0-9]+/"
            matches = list(re.finditer(r'Response body from /cms/v2/live_classes/(\d+)/:', content))
            if matches:
                for match in matches:
                    class_id = match.group(1)
                    start_idx = match.end()
                    line = content[match.start():].split('\n')[0]
                    line_json_idx = line.find('{')
                    if line_json_idx != -1:
                        try:
                            data = json.loads(line[line_json_idx:])
                            detail = data.get('data', data)
                            print(f"\nLog: {os.path.basename(p)}, Class ID: {class_id}")
                            print("Keys present in detail object:")
                            print(sorted(list(detail.keys())))
                            print("Credential fields:")
                            for k in ['zoom_meet_id', 'zoomMeetId', 'passcode', 'password', 'pwd', 'zoom_passcode', 'token']:
                                print(f"  {k}: {detail.get(k)}")
                            found_response = True
                        except Exception as e:
                            pass
                if found_response:
                    break
    except Exception as e:
        pass

if not found_response:
    print("Could not find live_classes detail responses in any task log.")
