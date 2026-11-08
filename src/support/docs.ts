import fs from 'node:fs/promises';
import path from 'node:path';

export async function saveDocScreenshot(name: string): Promise<void> {
  if (process.env.DOCS_SCREENSHOTS !== '1') {
    return;
  }
  const directory = path.resolve('docs/screenshots');
  await fs.mkdir(directory, { recursive: true });
  const png = await browser.takeScreenshot();
  await fs.writeFile(path.resolve(directory, `${name}.png`), Buffer.from(png, 'base64'));
}
