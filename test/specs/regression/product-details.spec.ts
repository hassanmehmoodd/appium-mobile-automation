import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { ProductScreen } from '../../../src/screens/ProductScreen.js';
import { catalog } from '../../../src/support/fixtures.js';

describe('Product details', () => {
  for (const item of catalog.details) {
    it(`shows price and description for ${item.name} @regression`, async () => {
      const catalogScreen = new CatalogScreen();
      await catalogScreen.waitForLoaded();
      await catalogScreen.openSort();
      await catalogScreen.chooseSort('Ascending order by price');
      await browser.waitUntil(
        async () => (await catalogScreen.firstProductTitle()) === 'Sauce Labs Onesie',
        { timeout: 15_000, timeoutMsg: 'Price sort did not finish before opening the product' },
      );
      await catalogScreen.openProduct(item.name);

      const product = new ProductScreen();
      await product.waitForName(item.name);
      await expect(await product.price()).toContain(item.price);
      await expect(await product.description()).toContain(item.descriptionIncludes);
    });
  }
});
