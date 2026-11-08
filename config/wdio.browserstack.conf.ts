import dotenv from 'dotenv';
import { browserStackCapabilities } from './capabilities/browserstack.js';
import { sharedConfig } from './wdio.shared.conf.js';

dotenv.config();

if (process.env.ENABLE_BROWSERSTACK !== 'true') {
  console.log('BrowserStack is disabled. Set ENABLE_BROWSERSTACK=true to run it.');
  process.exit(0);
}

const username = process.env.BROWSERSTACK_USERNAME?.trim();
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY?.trim();
if (!username || !accessKey) {
  console.error(
    'ENABLE_BROWSERSTACK=true but BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY is missing.',
  );
  process.exit(1);
}

export const config = sharedConfig({
  target: 'browserstack',
  downloadApk: false,
  capabilities: browserStackCapabilities(),
  hostname: 'hub.browserstack.com',
  port: 443,
  protocol: 'https',
  path: '/wd/hub',
  user: username,
  key: accessKey,
  logLevel: 'error',
});
