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

export async function relaunchApp(): Promise<void> {
  try {
    await browser.execute('mobile: terminateApp', { appId: APP_PACKAGE });
  } catch {
    // The first test can start before a previous process exists.
  }
  await browser.execute('mobile: activateApp', { appId: APP_PACKAGE });
  await grantRuntimePromptIfShown();
  const menu = await $('~View menu');
  await menu.waitForDisplayed({ timeout: 30_000 });
}
