import { appUnderTest } from '../app-meta.js';

/** Disabled unless ENABLE_SAUCE=true. `SAUCE_APP` should be a Sauce storage id or a public app URL. */
export function sauceCapabilities(): WebdriverIO.Capabilities[] {
  const app = appUnderTest();
  return [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': process.env.SAUCE_APP?.trim() || app.apkUrl,
      'appium:deviceName':
        process.env.SAUCE_DEVICE_NAME?.trim() || 'Google Pixel 7 GoogleAPI Emulator',
      'appium:platformVersion': process.env.SAUCE_PLATFORM_VERSION?.trim() || '14',
      'appium:autoGrantPermissions': true,
      'appium:appPackage': app.package,
      'appium:appActivity': app.activity,
      'sauce:options': {
        name: 'My Demo App Android',
        build: 'portfolio',
        appiumVersion: '2.19.0',
      },
    },
  ];
}
