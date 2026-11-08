import { BaseScreen } from './BaseScreen.js';
import { MenuScreen } from './MenuScreen.js';
import { scrollUntilVisible } from '../support/gestures.js';
import { id, text } from '../support/selectors.js';

export class CatalogScreen extends BaseScreen {
  async waitForLoaded(): Promise<void> {
    await this.waitFor('~View menu');
    await this.waitFor('android=new UiSelector().description("Product Title").instance(0)');
  }

  async openMenu(): Promise<MenuScreen> {
    await this.tap('~View menu');
    const menu = new MenuScreen();
    await menu.waitForOpen();
    return menu;
  }

  async openCart(): Promise<void> {
    await this.tap('~View cart');
  }

  async openSort(): Promise<void> {
    await this.tap('~Shows current sorting order and displays available sorting options');
    await this.waitFor(text('Sort by:'));
  }

  async chooseSort(contentDescription: string): Promise<void> {
    await this.tap(`~${contentDescription}`);
  }

  async firstProductTitle(): Promise<string> {
    return this.read('android=new UiSelector().description("Product Title").instance(0)');
  }

  async openProduct(name: string): Promise<void> {
    await scrollUntilVisible(name);
    const escaped = name.replace(/"/g, '\\"');
    const image = await $(
      `//*[@text="${escaped}"]/preceding-sibling::*[@content-desc="Product Image"]`,
    ).getElement();
    await image.waitForDisplayed();
    const location = await image.getLocation();
    const size = await image.getSize();
    const { height } = await browser.getWindowRect();
    const x = Math.floor(location.x + size.width / 2);
    const y = Math.floor(location.y + size.height / 2);
    if (y < 160 || y > height - 320) {
      throw new Error(`Product image for ${name} is outside the safe tap area (${x}, ${y})`);
    }
    await browser.execute('mobile: clickGesture', { x, y });
  }

  async cartBadge(): Promise<string> {
    return this.read(id('cartTV'));
  }
}
