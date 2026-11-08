import { BaseScreen } from './BaseScreen.js';
import { MENU_SCROLL, text } from '../support/selectors.js';

export class MenuScreen extends BaseScreen {
  async waitForOpen(): Promise<void> {
    await this.waitFor(text('Catalog'));
  }

  async openItem(label: string): Promise<void> {
    const selector = `android=new UiScrollable(new UiSelector().description("${MENU_SCROLL}")).scrollIntoView(new UiSelector().text("${label}"))`;
    await this.tap(selector);
  }

  async openLogin(): Promise<void> {
    await this.openByDescription('Login Menu Item');
  }

  async showsLogout(): Promise<void> {
    const selector = `android=new UiScrollable(new UiSelector().description("${MENU_SCROLL}")).scrollIntoView(new UiSelector().description("Logout Menu Item"))`;
    await this.waitFor(selector);
  }

  async openAbout(): Promise<void> {
    await this.openItem('About');
  }

  async openDrawing(): Promise<void> {
    await this.openItem('Drawing');
  }

  async openCatalog(): Promise<void> {
    await this.openItem('Catalog');
  }

  private async openByDescription(description: string): Promise<void> {
    const selector = `android=new UiScrollable(new UiSelector().description("${MENU_SCROLL}")).scrollIntoView(new UiSelector().description("${description}"))`;
    await this.tap(selector);
  }
}
