export abstract class BaseScreen {
  protected async waitFor(selector: string, timeout = 15_000): Promise<WebdriverIO.Element> {
    const element = await $(selector).getElement();
    await element.waitForDisplayed({ timeout });
    return element;
  }

  protected async tap(selector: string, timeout = 15_000): Promise<void> {
    const element = await this.waitFor(selector, timeout);
    await element.click();
  }

  protected async read(selector: string): Promise<string> {
    const element = await this.waitFor(selector);
    return (await element.getText()).trim();
  }
}
