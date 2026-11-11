// Publish Red Sapphire Hinglish OTA Bundle (+ optional native APK) to GitHub branch `ota-hinglish`
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = 'C:/Users/Rajit/Desktop/NNL/Nightingale';
const ANDROID_ROOT = 'C:/Users/Rajit/Desktop/NNL/NightingaleAndroid';
const DESKTOP_APK = 'C:/Users/Rajit/Desktop/Red Sapphire Hinglish.apk';
const GH_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_PUSH_URL = GH_TOKEN
  ? `https://takexuu-ux:${GH_TOKEN}@github.com/takexuu-ux/Nightingale.git`
  : 'origin';
const OTA_TMP = 'C:/Users/Rajit/.gemini/antigravity/brain/a6e17b33-e713-4506-b729-09d2f1ca6f14/scratch/ota_stage';

const args = process.argv.slice(2);
const notesIdx = args.indexOf('--notes');
const releaseNotes = notesIdx >= 0 && args[notesIdx + 1]
  ? args[notesIdx + 1]
  : 'Red Sapphire (Hinglish) latest fixes & batch sync update';

console.log('1. Building Hinglish-only Vite bundle...');
execSync('npm run build:apk', { cwd: ROOT, stdio: 'inherit' });

// Determine target webVersion BEFORE zipping so version.json inside bundle matches manifest.json 1:1
let nextWebVersion = 1;
try {
  const res = await fetch(`https://api.github.com/repos/takexuu-ux/Nightingale/contents/manifest.json?ref=ota-hinglish`, {
    headers: { 'Accept': 'application/vnd.github.raw+json', 'User-Agent': 'NightingalePublisher' }
  });
  if (res.ok) {
    const cur = await res.json();
    nextWebVersion = (Number(cur.webVersion) || 0) + 1;
  }
} catch {}

// Write version.json into dist/ cleanly
fs.writeFileSync(path.join(ROOT, 'dist', 'version.json'), JSON.stringify({ webVersion: nextWebVersion }));

console.log(`2. Packaging lightweight hinglish-bundle.zip (webVersion=${nextWebVersion})...`);
fs.rmSync(OTA_TMP, { recursive: true, force: true });
fs.mkdirSync(OTA_TMP, { recursive: true });

// Exclude unchanged large static background files so Web OTA stays ~230 KB
const otaWebStage = path.join(OTA_TMP, 'web_files');
fs.mkdirSync(otaWebStage, { recursive: true });
for (const entry of fs.readdirSync(`${ROOT}/dist`)) {
  const lower = entry.toLowerCase();
  if (lower.endsWith('.mp4') || lower === 'bg.svg' || lower === 'nightingale.jpg' || lower === 'nightingale.png') continue;
  fs.cpSync(path.join(`${ROOT}/dist`, entry), path.join(otaWebStage, entry), { recursive: true });
}

const zipPath = path.join(OTA_TMP, 'hinglish-bundle.zip');
execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${otaWebStage}/*' -DestinationPath '${zipPath}' -Force"`,
  { stdio: 'inherit' }
);
fs.rmSync(otaWebStage, { recursive: true, force: true });

// Read NATIVE_VERSION_CODE from OtaManager.java
const otaJava = fs.readFileSync(`${ANDROID_ROOT}/app/src/main/java/in/nightingale/hinglish/OtaManager.java`, 'utf8');
const nativeMatch = otaJava.match(/NATIVE_VERSION_CODE\s*=\s*(\d+)/);
const nativeVersionCode = nativeMatch ? Number(nativeMatch[1]) : 7;

const manifest = {
  webVersion: nextWebVersion,
  nativeVersionCode,
  updatedAt: new Date().toISOString(),
  notes: releaseNotes,
  zipUrl: 'https://raw.githubusercontent.com/takexuu-ux/Nightingale/refs/heads/ota-hinglish/hinglish-bundle.zip',
  apkUrl: 'https://raw.githubusercontent.com/takexuu-ux/Nightingale/refs/heads/ota-hinglish/RedSapphireHinglish.apk'
};

fs.writeFileSync(path.join(OTA_TMP, 'manifest.json'), JSON.stringify(manifest, null, 2));

const builtApk = `${ANDROID_ROOT}/app/build/outputs/apk/debug/app-debug.apk`;
if (fs.existsSync(DESKTOP_APK)) {
  fs.copyFileSync(DESKTOP_APK, path.join(OTA_TMP, 'RedSapphireHinglish.apk'));
} else if (fs.existsSync(builtApk)) {
  fs.copyFileSync(builtApk, path.join(OTA_TMP, 'RedSapphireHinglish.apk'));
}

console.log(`3. Publishing webVersion=${nextWebVersion}, nativeVersionCode=${nativeVersionCode} to GitHub ota-hinglish...`);
execSync('git init', { cwd: OTA_TMP, stdio: 'inherit' });
execSync('git checkout -b ota-hinglish', { cwd: OTA_TMP, stdio: 'inherit' });
execSync('git add manifest.json hinglish-bundle.zip RedSapphireHinglish.apk', { cwd: OTA_TMP, stdio: 'inherit' });
execSync(`git commit -m "Publish OTA web v${nextWebVersion} (native v${nativeVersionCode})"`, { cwd: OTA_TMP, stdio: 'inherit' });
execSync(`git push --force "${REPO_PUSH_URL}" ota-hinglish`, { cwd: OTA_TMP, stdio: 'inherit' });

console.log('Done! OTA Manifest published cleanly.');
