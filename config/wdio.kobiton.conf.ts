import dotenv from 'dotenv';
import { kobitonCapabilities } from './capabilities/kobiton.js';
import { sharedConfig } from './wdio.shared.conf.js';

dotenv.config();

const username = process.env.KOBITON_USERNAME?.trim();
const apiKey = process.env.KOBITON_API_KEY?.trim();

if (!username || !apiKey) {
  console.log('KOBITON_USERNAME and KOBITON_API_KEY are not set. Skipping the Kobiton run.');
  process.exit(0);
}

export const config = sharedConfig({
  target: 'kobiton',
  downloadApk: false,
  capabilities: kobitonCapabilities(),
  hostname: 'api.kobiton.com',
  port: 443,
  protocol: 'https',
  path: '/wd/hub',
  user: username,
  key: apiKey,
  logLevel: 'error',
  mochaRetries: 0,
});
