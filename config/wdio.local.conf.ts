import dotenv from 'dotenv';
import { emulatorCapabilities } from './capabilities/emulator.js';
import { localAppiumService, sharedConfig } from './wdio.shared.conf.js';

dotenv.config();

export const config = sharedConfig({
  target: 'local-emulator',
  downloadApk: true,
  capabilities: emulatorCapabilities(),
  services: localAppiumService,
});
