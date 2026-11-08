import { APP_PACKAGE } from './selectors.js';
import { grantRuntimePromptIfShown } from './visibility.js';

export async function useThreeButtonNavigation(): Promise<void> {
  try {
    await browser.execute('mobile: shell', {
      command: 'cmd',
      args: ['overlay', 'enable', 'com.android.internal.systemui.navbar.threebutton'],
    });
    await browser.pause(400);
  } catch (error) {
    console.warn('Three-button navigation was not enabled', error);
  }
}

export async function dismissAnrIfPresent(): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const buttons = await $$('android=new UiSelector().text("Wait")').getElements();
    if (buttons.length === 0) {
      return;
    }
    const visible = await buttons[0].isDisplayed().catch(() => false);
    if (!visible) {
      return;
    }
    await buttons[0].click();
  }
}

export async function relaunchApp(): Promise<void> {
  try {
    await browser.execute('mobile: terminateApp', { appId: APP_PACKAGE });
  } catch {
    // The first test can start before a previous process exists.
  }
  await browser.execute('mobile: activateApp', { appId: APP_PACKAGE });
  await grantRuntimePromptIfShown();
  await dismissAnrIfPresent();
  const menu = await $('~View menu');
  try {
    await menu.waitForDisplayed({ timeout: 20_000 });
  } catch {
    await dismissAnrIfPresent();
    await menu.waitForDisplayed({ timeout: 20_000 });
  }
}
