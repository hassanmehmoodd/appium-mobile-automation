import { BaseScreen } from './BaseScreen.js';
import { dragAcross, longClickGesture } from '../support/gestures.js';
import { text } from '../support/selectors.js';
import { grantRuntimePromptIfShown } from '../support/visibility.js';

export class DrawingScreen extends BaseScreen {
  async waitForLoaded(): Promise<void> {
    await grantRuntimePromptIfShown();
    await this.waitFor(text('Drawing'));
    await this.waitFor('~Pad to draw on');
  }

  async drawAndHold(): Promise<void> {
    const pad = await this.waitFor('~Pad to draw on');
    await dragAcross(pad);
    await longClickGesture(pad);
  }

  async save(): Promise<void> {
    await this.tap('~Save anything drawn on pad');
    await this.waitFor(text('Drawing saved successfully to gallery'));
  }
}
