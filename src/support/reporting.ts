import fs from 'node:fs/promises';
import path from 'node:path';
import { addAttachment } from '@wdio/allure-reporter';

export async function attachFailureEvidence(title: string): Promise<void> {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  const baseName = `${stamp}-${slug || 'failure'}`;

  try {
    const png = await browser.takeScreenshot();
    const buffer = Buffer.from(png, 'base64');
    await fs.mkdir(path.resolve('screenshots'), { recursive: true });
    await fs.writeFile(path.resolve('screenshots', `${baseName}.png`), buffer);
    await addAttachment('Failure screenshot', buffer, 'image/png');
  } catch (error) {
    console.warn('Could not capture a failure screenshot', error);
  }

  try {
    const logs = await browser.execute('mobile: shell', {
      command: 'logcat',
      args: ['-d', '-t', '200'],
    });
    const text = asText(logs).slice(-20_000);
    await fs.writeFile(path.resolve('screenshots', `${baseName}.logcat.txt`), text);
    await addAttachment('logcat', text, 'text/plain');
  } catch (error) {
    console.warn('Could not capture logcat', error);
  }
}

function asText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object' && 'stdout' in value) {
    const stdout = (value as { stdout?: unknown }).stdout;
    if (typeof stdout === 'string') {
      return stdout;
    }
  }
  return JSON.stringify(value);
}
