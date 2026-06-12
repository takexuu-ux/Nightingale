import subprocess

cmd = 'git show cfcc27d:src/main.js'
res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
content = res.stdout

pos = content.find('function joinEmbeddedClassroom')
if pos != -1:
    print(content[pos:pos+1500])
else:
    print("Not found")
