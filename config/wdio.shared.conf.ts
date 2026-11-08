import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import type { Options } from '@wdio/types';
import { appUnderTest } from './app-meta.js';
import { attachFailureEvidence } from '../src/support/reporting.js';
import { relaunchApp, useThreeButtonNavigation } from '../src/support/app.js';

export interface SharedOptions {
  target: string;
  downloadApk?: boolean;
  capabilities: WebdriverIO.Capabilities[];
  services?: Options.Testrunner['services'];
  hostname?: string;
  port?: number;
  path?: string;
  protocol?: 'http' | 'https';
  user?: string;
  key?: string;
  logLevel?: Options.WebdriverIO['logLevel'];
  mochaRetries?: number;
  specFileRetries?: number;
}

export function sharedConfig(options: SharedOptions): WebdriverIO.Config {
  const grep = process.env.MOCHA_GREP?.trim();

  return {
    runner: 'local',
    specs: ['../test/specs/**/*.ts'],
    suites: {
      smoke: ['../test/specs/smoke/**/*.ts'],
      regression: ['../test/specs/regression/**/*.ts'],
    },
    maxInstances: 1,
    capabilities: options.capabilities,
    hostname: options.hostname,
    port: options.port,
    path: options.path,
    protocol: options.protocol,
    user: options.user,
    key: options.key,
    logLevel: options.logLevel ?? 'info',
    bail: 0,
    waitforTimeout: 15_000,
    connectionRetryTimeout: 180_000,
    connectionRetryCount: 2,
    specFileRetries: options.specFileRetries ?? 0,
    specFileRetriesDelay: 0,
    services: options.services ?? [],
    framework: 'mocha',
    reporters: [
      'spec',
      [
        'allure',
        {
          outputDir: 'allure-results',
          disableWebdriverStepsReporting: false,
          disableWebdriverScreenshotsReporting: false,
          addConsoleLogs: true,
          reportedEnvironmentVars: {
            Target: options.target,
            Application: `${appUnderTest().name} ${appUnderTest().version}`,
          },
        },
      ],
    ],
    mochaOpts: {
      ui: 'bdd',
      timeout: 180_000,
      retries: options.mochaRetries ?? 0,
      ...(grep ? { grep } : {}),
    },
    onPrepare: () => {
      if (options.downloadApk) {
        const result = spawnSync(process.execPath, ['scripts/download-apk.mjs'], {
          stdio: 'inherit',
          env: process.env,
        });
        if (result.status !== 0) {
          throw new Error('Unable to download the application under test');
        }
      }

      fs.mkdirSync('allure-results', { recursive: true });
      fs.mkdirSync('screenshots', { recursive: true });
      fs.mkdirSync('logs', { recursive: true });
      const app = appUnderTest();
      fs.writeFileSync(
        'allure-results/environment.properties',
        [
          `Target=${options.target}`,
          `App=${app.name} ${app.version}`,
          `Package=${app.package}`,
          `Automation=UiAutomator2`,
          `Appium=2.19`,
          `Node=${process.version}`,
        ].join('\n'),
      );
    },
    before: async () => {
      await browser.setTimeout({ implicit: 0 });
      await browser.updateSettings({
        ignoreUnimportantViews: false,
        waitForIdleTimeout: 1000,
      });
      await useThreeButtonNavigation();
    },
    beforeTest: async () => {
      await relaunchApp();
    },
    afterTest: async (test, _context, result) => {
      if (result.passed) {
        return;
      }
      await attachFailureEvidence(test.title);
    },
  };
}

export const localAppiumService: NonNullable<Options.Testrunner['services']> = [
  [
    'appium',
    {
      command: 'appium',
      logPath: './logs/',
      args: {
        relaxedSecurity: true,
      },
    },
  ],
];
