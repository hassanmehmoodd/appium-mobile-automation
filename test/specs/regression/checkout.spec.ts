import { CartScreen } from '../../../src/screens/CartScreen.js';
import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { CheckoutScreen } from '../../../src/screens/CheckoutScreen.js';
import { LoginScreen } from '../../../src/screens/LoginScreen.js';
import { ProductScreen } from '../../../src/screens/ProductScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';
import { catalog, checkoutData } from '../../../src/support/fixtures.js';

describe('Checkout', () => {
  it('completes checkout after signing in from the cart @regression', async () => {
    const product = catalog.backpack;
    const catalogScreen = new CatalogScreen();
    await catalogScreen.waitForLoaded();
    await catalogScreen.openProduct(product.name);

    const details = new ProductScreen();
    await details.waitForName(product.name);
    await details.addToCart();
    await catalogScreen.openCart();

    const cart = new CartScreen();
    await cart.waitForItem(product.name);
    await cart.proceedToCheckout();

    const login = new LoginScreen();
    await login.waitForLoaded();
    await login.submit('bod@example.com', '10203040');

    const checkout = new CheckoutScreen();
    await checkout.fillShipping(checkoutData.shipping);
    await checkout.fillPayment(checkoutData.payment);
    await checkout.expectReview(checkoutData.shipping.fullName);
    await checkout.placeOrder();
    await checkout.expectComplete();
    await saveDocScreenshot('08-checkout-complete');
  });
});
