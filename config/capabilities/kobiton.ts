import { appUnderTest } from '../app-meta.js';

/**
 * Basic Appium 2 session on Kobiton.
 * `kobiton:runtime=appium` is required for UiAutomator2 on Kobiton's basic server.
 * flexCorrect and scriptless capture are Xium features and are intentionally unset.
 * https://docs.kobiton.com/automation-testing/basic-appium-server/launch-a-basic-appium-2-session
 */
export function kobitonCapabilities(): WebdriverIO.Capabilities[] {
  const username = requiredEnv('KOBITON_USERNAME');
  const accessKey = requiredEnv('KOBITON_API_KEY');
  const app = appUnderTest();

  const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': envOr('*', 'KOBITON_DEVICE_NAME'),
    'appium:orientation': 'PORTRAIT',
    'appium:autoGrantPermissions': true,
    'appium:noReset': true,
    'appium:newCommandTimeout': 300,
    'appium:username': username,
    'appium:accessKey': accessKey,
    'appium:appPackage': app.package,
    'appium:appActivity': app.activity,
    'appium:appWaitActivity': `${app.package}.view.activities.*`,
    'appium:appWaitDuration': 120_000,
    'kobiton:runtime': 'appium',
    'kobiton:app': envOr(app.apkUrl, 'KOBITON_APP_URL'),
    'kobiton:sessionName': 'My Demo App Android',
    'kobiton:sessionDescription': 'Portfolio suite for Sauce Labs My Demo App',
    'kobiton:deviceGroup': envOr('KOBITON', 'KOBITON_DEVICE_GROUP'),
  } as WebdriverIO.Capabilities;

  return [capabilities];
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function envOr(fallback: string, name: string): string {
  return process.env[name]?.trim() || fallback;
}
