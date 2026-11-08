import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const meta = JSON.parse(readFileSync(new URL('../app-under-test.json', import.meta.url), 'utf8'));
const destination = resolve(process.cwd(), process.env.APK_PATH || meta.apkFile);
const url = process.env.APK_URL || meta.apkUrl;

function verify(buffer) {
  if (buffer.length < 1_000_000) {
    throw new Error(`APK is unexpectedly small (${buffer.length} bytes)`);
  }
  const digest = createHash('sha256').update(buffer).digest('hex');
  if (meta.sha256 && digest !== meta.sha256) {
    throw new Error(`APK sha256 mismatch. Expected ${meta.sha256}, got ${digest}`);
  }
  return digest;
}

if (existsSync(destination) && statSync(destination).size > 1_000_000) {
  const digest = verify(readFileSync(destination));
  console.log(`APK already present at ${destination}`);
  console.log(`sha256 ${digest}`);
  process.exit(0);
}

mkdirSync(dirname(destination), { recursive: true });
console.log(`Downloading ${url}`);

const response = await fetch(url, { redirect: 'follow' });
if (!response.ok) {
  throw new Error(`APK download failed with HTTP ${response.status}`);
}

const buffer = Buffer.from(await response.arrayBuffer());
const digest = verify(buffer);

writeFileSync(destination, buffer);
console.log(`Saved ${destination} (${buffer.length} bytes)`);
console.log(`sha256 ${digest}`);
