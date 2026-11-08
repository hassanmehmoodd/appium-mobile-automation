import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';

describe('Catalog launch', () => {
  it('shows the product catalog after launch @smoke', async () => {
    const catalog = new CatalogScreen();
    await catalog.waitForLoaded();

    await expect($('~View menu')).toBeDisplayed();
    await expect($('~View cart')).toBeDisplayed();
    await expect($('android=new UiSelector().text("Products")')).toBeDisplayed();
    await saveDocScreenshot('01-catalog');
  });
});
