import { appUnderTest, localApkPath } from '../app-meta.js';

/**
 * Capabilities for an Android emulator that is already running.
 * Local and CI both boot the emulator outside Appium, then attach.
 */
export function emulatorCapabilities(
  timeouts: {
    adbExecTimeout: number;
    installTimeout: number;
    unicodeKeyboard?: boolean;
  } = {
    adbExecTimeout: 60_000,
    installTimeout: 120_000,
    unicodeKeyboard: true,
  },
): WebdriverIO.Capabilities[] {
  const app = appUnderTest();
  const capabilities: WebdriverIO.Capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': localApkPath(),
    'appium:appPackage': app.package,
    'appium:appActivity': app.activity,
    'appium:appWaitActivity': `${app.package}.view.activities.*`,
    'appium:appWaitDuration': 60_000,
    'appium:autoGrantPermissions': true,
    'appium:noReset': true,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 240,
    'appium:adbExecTimeout': timeouts.adbExecTimeout,
    'appium:androidInstallTimeout': timeouts.installTimeout,
    'appium:uiautomator2ServerInstallTimeout': timeouts.installTimeout,
    'appium:uiautomator2ServerLaunchTimeout': timeouts.installTimeout,
    'appium:unicodeKeyboard': timeouts.unicodeKeyboard !== false,
    'appium:resetKeyboard': timeouts.unicodeKeyboard !== false,
    'appium:ignoreHiddenApiPolicyError': true,
    'appium:disableWindowAnimation': true,
  };

  const udid = process.env.ANDROID_UDID?.trim();
  if (udid) {
    capabilities['appium:udid'] = udid;
  }

  return [capabilities];
}
