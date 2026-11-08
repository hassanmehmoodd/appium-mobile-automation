import { CartScreen } from '../../../src/screens/CartScreen.js';
import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { ProductScreen } from '../../../src/screens/ProductScreen.js';
import { catalog } from '../../../src/support/fixtures.js';

describe('Cart quantity', () => {
  it('increases the quantity from the cart @regression', async () => {
    // Sauce Labs Bolt T-Shirt is intentionally forced to quantity 10 by the app.
    const product = catalog.backpack;
    const catalogScreen = new CatalogScreen();
    await catalogScreen.waitForLoaded();
    await catalogScreen.openProduct(product.name);

    const details = new ProductScreen();
    await details.waitForName(product.name);
    await details.increaseQuantity(1);
    await expect(await details.quantity()).toBe('2');
    await details.addToCart();

    await catalogScreen.openCart();
    const cart = new CartScreen();
    await cart.waitForItem(product.name);
    await expect(await cart.quantity()).toBe('2');
    await cart.increase();
    await expect(await cart.quantity()).toBe('3');
    await expect(await cart.itemCountLabel()).toContain('3');
  });
});
