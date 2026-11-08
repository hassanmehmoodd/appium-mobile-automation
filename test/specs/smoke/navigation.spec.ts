import { AboutScreen } from '../../../src/screens/AboutScreen.js';
import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';

describe('Navigation', () => {
  it('opens About from the menu and returns to the catalog @smoke', async () => {
    const catalog = new CatalogScreen();
    await catalog.waitForLoaded();
    const menu = await catalog.openMenu();
    await menu.openAbout();

    const about = new AboutScreen();
    await about.waitForLoaded();
    await saveDocScreenshot('05-about');

    const again = new CatalogScreen();
    const drawer = await again.openMenu();
    await drawer.openCatalog();
    await again.waitForLoaded();
  });
});
