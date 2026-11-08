import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface AppUnderTest {
  name: string;
  version: string;
  package: string;
  activity: string;
  apkUrl: string;
  apkFile: string;
  source: string;
  sha256: string;
}

export function appUnderTest(): AppUnderTest {
  const file = path.resolve('app-under-test.json');
  return JSON.parse(readFileSync(file, 'utf8')) as AppUnderTest;
}

export function localApkPath(): string {
  return path.resolve(process.env.APK_PATH || appUnderTest().apkFile);
}
