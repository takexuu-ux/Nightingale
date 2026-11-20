// Publish Red Sapphire Hinglish OTA Bundle (+ optional native APK) to GitHub branch `ota-hinglish`
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = 'C:/Users/Rajit/Desktop/NNL/Nightingale';
const ANDROID_ROOT = 'C:/Users/Rajit/Desktop/NNL/NightingaleAndroid';
const DESKTOP_APK = fs.existsSync('C:/Users/Rajit/Desktop/Nightingale.apk')
  ? 'C:/Users/Rajit/Desktop/Nightingale.apk'
  : (fs.existsSync('C:/Users/Rajit/Desktop/Nightingale App.apk')
      ? 'C:/Users/Rajit/Desktop/Nightingale App.apk'
      : 'C:/Users/Rajit/Desktop/Red Sapphire Hinglish.apk');
const GH_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_PUSH_URL = GH_TOKEN
  ? `https://takexuu-ux:${GH_TOKEN}@github.com/takexuu-ux/Nightingale.git`
  : 'https://github.com/takexuu-ux/Nightingale.git';
const OTA_TMP = 'C:/Users/Rajit/.gemini/antigravity/brain/a6e17b33-e713-4506-b729-09d2f1ca6f14/scratch/ota_stage';

const args = process.argv.slice(2);
const notesIdx = args.indexOf('--notes');
const releaseNotes = notesIdx >= 0 && args[notesIdx + 1]
  ? args[notesIdx + 1]
  : 'Red Sapphire (Hinglish) latest fixes & batch sync update';

console.log('1. Building Hinglish-only Vite bundle...');
execSync('npm run build:apk', { cwd: ROOT, stdio: 'inherit' });

// Determine target webVersion BEFORE zipping so version.json inside bundle matches manifest.json 1:1
const webArgIdx = args.indexOf('--web');
let nextWebVersion = webArgIdx >= 0 && args[webArgIdx + 1] ? Number(args[webArgIdx + 1]) : 200;
if (webArgIdx < 0) {
  try {
    const res = await fetch(`https://api.github.com/repos/takexuu-ux/Nightingale/contents/manifest.json?ref=ota-hinglish`, {
      headers: { 'Accept': 'application/vnd.github.raw+json', 'User-Agent': 'NightingalePublisher' }
    });
    if (res.ok) {
      const cur = await res.json();
      const remoteV = Number(cur.webVersion) || 0;
      nextWebVersion = Math.max(200, remoteV + 1);
    }
  } catch {}
}

// Write version.json into dist/ cleanly
fs.writeFileSync(path.join(ROOT, 'dist', 'version.json'), JSON.stringify({ webVersion: nextWebVersion }));

console.log(`2. Packaging lightweight hinglish-bundle.zip (webVersion=${nextWebVersion})...`);
fs.rmSync(OTA_TMP, { recursive: true, force: true });
fs.mkdirSync(OTA_TMP, { recursive: true });

// Exclude unchanged large static background files and pet spritesheets so Web OTA stays ~500 KB
const otaWebStage = path.join(OTA_TMP, 'web_files');
fs.mkdirSync(otaWebStage, { recursive: true });
for (const entry of fs.readdirSync(`${ROOT}/dist`)) {
  const lower = entry.toLowerCase();
  if (lower.startsWith('pets') || lower.startsWith('bg-web-landscape') || lower.endsWith('.mp4') || lower === 'bg.svg' || lower === 'nightingale.jpg' || lower === 'nightingale.png') continue;
  fs.cpSync(path.join(`${ROOT}/dist`, entry), path.join(otaWebStage, entry), { recursive: true });
}

const zipPath = path.join(OTA_TMP, 'hinglish-bundle.zip');
// Use Python's built-in zipfile to create clean relative paths without leading './' or root dot entries
const pyZipScript = `
import os, zipfile
stage = r"${otaWebStage.replace(/\\/g, '/')}"
out = r"${zipPath.replace(/\\/g, '/')}"
with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(stage):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, stage).replace('\\\\\\\\', '/')
            zf.write(full, rel)
`;
fs.writeFileSync(path.join(OTA_TMP, 'make_zip.py'), pyZipScript);
execSync(`python "${path.join(OTA_TMP, 'make_zip.py')}"`, { stdio: 'inherit' });
fs.rmSync(path.join(OTA_TMP, 'make_zip.py'), { force: true });
fs.rmSync(otaWebStage, { recursive: true, force: true });

// Read NATIVE_VERSION_CODE from OtaManager.java (allow override via CLI flag --native)
const nativeArgIdx = args.indexOf('--native');
let nativeVersionCode = 1; // default to 1 so ALL phones perform instant in-app web update (<1s) without downloading 50MB+ APK
if (nativeArgIdx >= 0 && args[nativeArgIdx + 1]) {
  nativeVersionCode = Number(args[nativeArgIdx + 1]);
}

const manifest = {
  webVersion: nextWebVersion,
  nativeVersionCode,
  updatedAt: new Date().toISOString(),
  notes: releaseNotes,
  zipUrl: 'https://raw.githubusercontent.com/takexuu-ux/Nightingale/refs/heads/ota-hinglish/hinglish-bundle.zip',
  apkUrl: 'https://raw.githubusercontent.com/takexuu-ux/Nightingale/refs/heads/ota-hinglish/Nightingale.apk'
};

fs.writeFileSync(path.join(OTA_TMP, 'manifest.json'), JSON.stringify(manifest, null, 2));

const builtApk = `${ANDROID_ROOT}/app/build/outputs/apk/debug/app-debug.apk`;
if (fs.existsSync(DESKTOP_APK)) {
  fs.copyFileSync(DESKTOP_APK, path.join(OTA_TMP, 'Nightingale.apk'));
  fs.copyFileSync(DESKTOP_APK, path.join(OTA_TMP, 'RedSapphireHinglish.apk'));
} else if (fs.existsSync(builtApk)) {
  fs.copyFileSync(builtApk, path.join(OTA_TMP, 'Nightingale.apk'));
  fs.copyFileSync(builtApk, path.join(OTA_TMP, 'RedSapphireHinglish.apk'));
}

console.log(`3. Publishing webVersion=${nextWebVersion}, nativeVersionCode=${nativeVersionCode} to GitHub ota-hinglish...`);
execSync('git init', { cwd: OTA_TMP, stdio: 'inherit' });
execSync('git checkout -b ota-hinglish', { cwd: OTA_TMP, stdio: 'inherit' });
execSync('git add manifest.json hinglish-bundle.zip Nightingale.apk RedSapphireHinglish.apk', { cwd: OTA_TMP, stdio: 'inherit' });
execSync(`git commit -m "Publish OTA web v${nextWebVersion} (native v${nativeVersionCode})"`, { cwd: OTA_TMP, stdio: 'inherit' });
execSync(`git push --force "${REPO_PUSH_URL}" ota-hinglish`, { cwd: OTA_TMP, stdio: 'inherit' });

console.log('Done! OTA Manifest published cleanly.');
