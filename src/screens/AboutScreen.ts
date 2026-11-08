import { BaseScreen } from './BaseScreen.js';
import { text } from '../support/selectors.js';

export class AboutScreen extends BaseScreen {
  async waitForLoaded(): Promise<void> {
    await this.waitFor(text('Go to the Sauce Labs website.'));
  }
}
