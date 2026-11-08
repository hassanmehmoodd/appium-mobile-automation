export async function hideKeyboard(): Promise<void> {
  try {
    if (await browser.isKeyboardShown()) {
      await browser.hideKeyboard();
    }
  } catch {
    // Keyboard queries are best-effort on emulator images.
  }
}

export async function replaceText(
  selector: string,
  value: string,
  options: { secure?: boolean } = {},
): Promise<void> {
  const element = await $(selector);
  await element.waitForDisplayed({ timeout: 20_000 });
  await element.click();
  try {
    await element.clearValue();
  } catch {
    // Custom edit texts sometimes reject clearValue until they have focus.
  }
  await element.setValue(value);
  if (options.secure) {
    return;
  }

  const actual = (await element.getText()).trim();
  if (matchesEntry(actual, value)) {
    return;
  }

  await element.click();
  try {
    await element.clearValue();
  } catch {
    // Fall through to a shell keystroke if the field cannot be cleared.
  }
  const encoded = value.replace(/ /g, '%s').replace(/@/g, '\\@');
  await browser.execute('mobile: shell', {
    command: 'input',
    args: ['text', encoded],
  });
}

function matchesEntry(actual: string, expected: string): boolean {
  if (actual.includes(expected)) {
    return true;
  }
  const digits = (input: string) => input.replace(/\D/g, '');
  const actualDigits = digits(actual);
  const expectedDigits = digits(expected);
  return (
    expectedDigits.length > 0 &&
    (actualDigits.includes(expectedDigits) || expectedDigits.includes(actualDigits))
  );
}
