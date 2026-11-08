import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { ProductScreen } from '../../../src/screens/ProductScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';
import { catalog } from '../../../src/support/fixtures.js';

describe('Product catalog', () => {
  it('opens a product from the catalog @smoke', async () => {
    const product = catalog.backpack;
    const screen = new CatalogScreen();
    await screen.waitForLoaded();
    await screen.openProduct(product.name);

    const details = new ProductScreen();
    await details.waitForName(product.name);
    await expect(await details.price()).toContain(product.price);
    await expect(await details.description()).toContain(product.descriptionIncludes);
    await saveDocScreenshot('03-product-details');
  });
});
