import { BaseScreen } from './BaseScreen.js';
import type { CheckoutData } from '../support/fixtures.js';
import { FORM_SCROLL, scrollResource, text } from '../support/selectors.js';
import { hideKeyboard, replaceText } from '../support/text-entry.js';

export class CheckoutScreen extends BaseScreen {
  async fillShipping(shipping: CheckoutData['shipping']): Promise<void> {
    await this.waitFor(text('Enter a shipping address'));
    await this.fill('fullNameET', shipping.fullName);
    await this.fill('address1ET', shipping.address1);
    await this.fill('address2ET', shipping.address2);
    await this.fill('cityET', shipping.city);
    await this.fill('stateET', shipping.state);
    await this.fill('zipET', shipping.zip);
    await this.fill('countryET', shipping.country);
    await hideKeyboard();
    await this.tapLabel('To Payment');
  }

  async fillPayment(payment: CheckoutData['payment']): Promise<void> {
    await this.waitFor(text('Enter a payment method'));
    await this.fill('nameET', payment.name);
    await this.fill('cardNumberET', payment.cardNumber);
    await this.fill('expirationDateET', payment.expiration);
    await this.fill('securityCodeET', payment.securityCode);
    await hideKeyboard();
    await this.tapLabel('Review Order');
  }

  async expectReview(fullName: string): Promise<void> {
    await this.waitFor(text('Review your order'));
    await this.waitFor(text(fullName));
  }

  async placeOrder(): Promise<void> {
    await this.tapLabel('Place Order');
  }

  async expectComplete(): Promise<void> {
    await this.waitFor(text('Checkout Complete'), 20_000);
    await this.waitFor(text('Thank you for your order'));
  }

  private async fill(resource: string, value: string): Promise<void> {
    await replaceText(scrollResource(FORM_SCROLL, resource), value);
  }

  private async tapLabel(label: string): Promise<void> {
    const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${label}"))`;
    await this.tap(selector);
  }
}
