import { emulatorCapabilities } from './capabilities/emulator.js';
import { localAppiumService, sharedConfig } from './wdio.shared.conf.js';

export const config = sharedConfig({
  target: 'ci-emulator',
  downloadApk: true,
  capabilities: emulatorCapabilities({
    adbExecTimeout: 120_000,
    installTimeout: 180_000,
    unicodeKeyboard: false,
  }),
  services: localAppiumService,
  logLevel: 'info',
  mochaRetries: 1,
  specFileRetries: 1,
});
