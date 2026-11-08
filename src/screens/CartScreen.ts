import { BaseScreen } from './BaseScreen.js';
import { id, text } from '../support/selectors.js';

export class CartScreen extends BaseScreen {
  async waitForItem(name: string): Promise<void> {
    await this.waitFor(text('My Cart'));
    await this.waitFor(text(name));
  }

  async quantity(): Promise<string> {
    return this.read(id('noTV'));
  }

  async increase(): Promise<void> {
    await this.tap('~Increase item quantity');
  }

  async itemCountLabel(): Promise<string> {
    return this.read(id('itemsTV'));
  }

  async proceedToCheckout(): Promise<void> {
    await this.tap('~Confirms products for checkout');
  }
}
