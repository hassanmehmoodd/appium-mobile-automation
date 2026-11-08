import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { LoginScreen } from '../../../src/screens/LoginScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';
import { loginCases } from '../../../src/support/fixtures.js';

describe('Negative login', () => {
  for (const loginCase of loginCases) {
    it(loginCase.title, async () => {
      const catalog = new CatalogScreen();
      await catalog.waitForLoaded();
      const menu = await catalog.openMenu();
      await menu.openLogin();

      const login = new LoginScreen();
      await login.waitForLoaded();
      await login.submit(loginCase.username, loginCase.password);

      await expect(await login.error(loginCase.errorField)).toBe(loginCase.expectedError);
      if (loginCase.username.includes('alice')) {
        await saveDocScreenshot('06-login-locked-out');
      }
    });
  }
});
