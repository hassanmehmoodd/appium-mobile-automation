import { CartScreen } from '../../../src/screens/CartScreen.js';
import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { ProductScreen } from '../../../src/screens/ProductScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';
import { catalog } from '../../../src/support/fixtures.js';

describe('Cart', () => {
  it('adds a product and shows it in the cart @smoke', async () => {
    const product = catalog.backpack;
    const catalogScreen = new CatalogScreen();
    await catalogScreen.waitForLoaded();
    await catalogScreen.openProduct(product.name);

    const details = new ProductScreen();
    await details.waitForName(product.name);
    await details.addToCart();
    await expect(await catalogScreen.cartBadge()).toBe('1');

    await catalogScreen.openCart();
    const cart = new CartScreen();
    await cart.waitForItem(product.name);
    await expect(await cart.quantity()).toBe('1');
    await expect(await cart.itemCountLabel()).toContain('1');
    await saveDocScreenshot('04-cart');
  });
});
