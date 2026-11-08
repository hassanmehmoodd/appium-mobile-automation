import { BaseScreen } from './BaseScreen.js';
import { longPress } from '../support/gestures.js';
import { APP_PACKAGE, id, text } from '../support/selectors.js';

export class ProductScreen extends BaseScreen {
  async waitForName(name: string): Promise<void> {
    await this.waitFor(text(name));
  }

  async price(): Promise<string> {
    return this.read(id('priceTV'));
  }

  async description(): Promise<string> {
    const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${APP_PACKAGE}:id/descTV"))`;
    return this.read(selector);
  }

  async quantity(): Promise<string> {
    return this.read(id('noTV'));
  }

  async increaseQuantity(times = 1): Promise<void> {
    for (let count = 0; count < times; count += 1) {
      await this.tap('~Increase item quantity');
    }
  }

  async addToCart(): Promise<void> {
    await this.tap('~Tap to add product to cart');
  }

  async longPressFirstStar(): Promise<void> {
    const stars = await $$(id('start1IV')).getElements();
    if (stars.length === 0) {
      throw new Error('Rating star was not found');
    }
    let star = stars[0];
    for (const candidate of stars) {
      if (await candidate.isDisplayed().catch(() => false)) {
        star = candidate;
        break;
      }
    }
    await longPress(star);
  }

  async expectReviewDialog(): Promise<void> {
    await this.waitFor(text('Thank you for submitting your review!'));
  }

  async closeReview(): Promise<void> {
    await this.tap('~Closes review dialog');
  }
}
