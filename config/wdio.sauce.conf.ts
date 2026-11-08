import dotenv from 'dotenv';
import { sauceCapabilities } from './capabilities/sauce.js';
import { sharedConfig } from './wdio.shared.conf.js';

dotenv.config();

if (process.env.ENABLE_SAUCE !== 'true') {
  console.log('Sauce Labs is disabled. Set ENABLE_SAUCE=true to run it.');
  process.exit(0);
}

const username = process.env.SAUCE_USERNAME?.trim();
const accessKey = process.env.SAUCE_ACCESS_KEY?.trim();
if (!username || !accessKey) {
  console.error('ENABLE_SAUCE=true but SAUCE_USERNAME or SAUCE_ACCESS_KEY is missing.');
  process.exit(1);
}

const region = process.env.SAUCE_REGION?.trim() || 'us-west-1';

export const config = sharedConfig({
  target: 'sauce',
  downloadApk: false,
  capabilities: sauceCapabilities(),
  hostname: `ondemand.${region}.saucelabs.com`,
  port: 443,
  protocol: 'https',
  path: '/wd/hub',
  user: username,
  key: accessKey,
  logLevel: 'error',
});
