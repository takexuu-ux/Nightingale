import requests
import base64
import json

# Read the new main.js content
with open(r"C:\Users\Rajit\Documents\antigravity\zealous-bohr\src\main.js", "rb") as f:
    content = f.read()

# Old SHA from GitHub
old_sha = "5c7622739cf34cad4df9d46954773023a424c4cd"

# Encode the content as base64 for GitHub API
encoded = base64.b64encode(content).decode('utf-8')

print("Content length:", len(content))
print("Base64 length:", len(encoded))
print("First 100 chars base64:", encoded[:100])
print("Old SHA:", old_sha)
print("New content SHA should be different from old.")
