import { BaseScreen } from './BaseScreen.js';
import { id, text } from '../support/selectors.js';
import { hideKeyboard, replaceText } from '../support/text-entry.js';

export class LoginScreen extends BaseScreen {
  async waitForLoaded(): Promise<void> {
    await this.waitFor(text('Login'));
    await this.waitFor(id('nameET'));
  }

  async submit(username: string, password: string): Promise<void> {
    if (username.length > 0) {
      await replaceText(id('nameET'), username);
    }
    if (password.length > 0) {
      await replaceText(id('passwordET'), password, { secure: true });
    }
    await hideKeyboard();
    await this.tap('~Tap to login with given credentials');
  }

  async error(field: 'username' | 'password'): Promise<string> {
    const selector = field === 'username' ? id('nameErrorTV') : id('passwordErrorTV');
    const element = await $(selector);
    await element.waitForDisplayed({ timeout: 10_000 });
    return (await element.getText()).trim();
  }
}
