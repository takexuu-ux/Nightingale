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

console.log('2. Packaging hinglish-bundle.zip...');
fs.rmSync(OTA_TMP, { recursive: true, force: true });
fs.mkdirSync(OTA_TMP, { recursive: true });

const zipPath = path.join(OTA_TMP, 'hinglish-bundle.zip');
execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${ROOT}/dist/*' -DestinationPath '${zipPath}' -Force"`,
  { stdio: 'inherit' }
);

// Check current manifest version on ota-hinglish if present
let nextWebVersion = 1;
try {
  const res = await fetch(`https://raw.githubusercontent.com/takexuu-ux/Nightingale/ota-hinglish/manifest.json?t=${Date.now()}`);
  if (res.ok) {
    const cur = await res.json();
    nextWebVersion = (Number(cur.webVersion) || 0) + 1;
  }
} catch {}

// Read NATIVE_VERSION_CODE from OtaManager.java
const otaJava = fs.readFileSync(`${ANDROID_ROOT}/app/src/main/java/in/nightingale/hinglish/OtaManager.java`, 'utf8');
const nativeMatch = otaJava.match(/NATIVE_VERSION_CODE\s*=\s*(\d+)/);
const nativeVersionCode = nativeMatch ? Number(nativeMatch[1]) : 2;

const manifest = {
  webVersion: nextWebVersion,
  nativeVersionCode,
  updatedAt: new Date().toISOString(),
  notes: releaseNotes,
  zipUrl: 'https://raw.githubusercontent.com/takexuu-ux/Nightingale/ota-hinglish/hinglish-bundle.zip',
  apkUrl: 'https://raw.githubusercontent.com/takexuu-ux/Nightingale/ota-hinglish/RedSapphireHinglish.apk'
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
