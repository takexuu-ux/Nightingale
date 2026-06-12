import subprocess

# Run git log -p to see previous versions of joinEmbeddedClassroom
cmd = 'git log -p -S "async function joinEmbeddedClassroom" src/main.js'
res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
print(res.stdout[:5000])
