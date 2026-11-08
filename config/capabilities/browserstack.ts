import { appUnderTest } from '../app-meta.js';

/** Disabled unless ENABLE_BROWSERSTACK=true. Credentials come only from the environment. */
export function browserStackCapabilities(): WebdriverIO.Capabilities[] {
  const app = appUnderTest();
  return [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': process.env.BROWSERSTACK_APP_URL?.trim() || app.apkUrl,
      'appium:deviceName': process.env.BROWSERSTACK_DEVICE_NAME?.trim() || 'Google Pixel 7',
      'appium:platformVersion': process.env.BROWSERSTACK_PLATFORM_VERSION?.trim() || '13.0',
      'appium:autoGrantPermissions': true,
      'appium:appPackage': app.package,
      'appium:appActivity': app.activity,
      'bstack:options': {
        userName: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        projectName: 'My Demo App Android',
        buildName: 'portfolio',
        sessionName: 'appium-mobile-automation',
      },
    },
  ];
}
