import re

log_path = r"C:\Users\Rajit\.gemini\antigravity\brain\ac0087f6-9837-49f9-9a17-f7be8deaf15e\.system_generated\tasks\task-7684.log"

with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

jwts = set(re.findall(r'(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)', content))
print(f"Found {len(jwts)} JWTs in task-7684.log")
for j in jwts:
    import base64
    import json
    try:
        payload = json.loads(base64.b64decode(j.split('.')[1] + '===').decode('utf-8'))
        print(f"Type: {payload.get('token_type')}, Exp: {payload.get('exp')}, Token: {j}")
    except Exception as e:
        print(f"Failed decoding JWT payload: {e}")
