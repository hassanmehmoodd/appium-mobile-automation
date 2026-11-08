import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { LoginScreen } from '../../../src/screens/LoginScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';

describe('Login', () => {
  it('signs in with the standard user printed in the app @smoke', async () => {
    const catalog = new CatalogScreen();
    await catalog.waitForLoaded();
    const menu = await catalog.openMenu();
    await menu.openLogin();

    const login = new LoginScreen();
    await login.waitForLoaded();
    await login.submit('bod@example.com', '10203040');

    const home = new CatalogScreen();
    await home.waitForLoaded();
    const signedIn = await home.openMenu();
    await signedIn.showsLogout();
    await saveDocScreenshot('02-logged-in-menu');
  });
});
