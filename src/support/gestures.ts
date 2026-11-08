import { text } from './selectors.js';
import { isShown } from './visibility.js';

/**
 * Press and hold with a W3C touch pointer.
 * The demo app's rating stars have a click listener and no long-click listener,
 * so a press longer than the platform long-press timeout still delivers the click.
 */
export async function longPress(element: WebdriverIO.Element, holdMs = 900): Promise<void> {
  await browser
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ origin: element, x: 0, y: 0 })
    .down()
    .pause(holdMs)
    .up()
    .perform();
}

/** UiAutomator2 scroll. `down` reveals content lower on the page. */
export async function scrollGesture(direction: 'up' | 'down'): Promise<void> {
  const { width, height } = await browser.getWindowRect();
  // Stay clear of the 3-button navigation bar. A release on Back finishes the activity.
  await browser.execute('mobile: scrollGesture', {
    left: Math.floor(width * 0.35),
    top: Math.floor(height * 0.22),
    width: Math.floor(width * 0.3),
    height: Math.floor(height * 0.35),
    direction,
    percent: 0.75,
    speed: 1200,
  });
}

export async function scrollUntilVisible(label: string): Promise<void> {
  const selector = text(label);
  if (await isShown(selector)) {
    return;
  }
  const scroller = await $(
    'android=new UiSelector().description("Scrollview manages views in given screen size")',
  ).getElement();
  const escaped = label.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  await browser.execute('mobile: scroll', {
    elementId: scroller.elementId,
    strategy: '-android uiautomator',
    selector: `new UiSelector().text("${escaped}")`,
    maxSwipes: 20,
  });
  const target = await $(selector);
  await target.waitForDisplayed({ timeout: 10_000 });
}

/**
 * Edge swipe that opens the navigation drawer.
 * The emulator is switched to 3-button navigation first so Android 14 does not
 * treat the same stroke as the system Back gesture.
 */
export async function swipeOpenDrawer(): Promise<void> {
  const { width, height } = await browser.getWindowRect();
  const y = Math.floor(height * 0.42);
  await browser
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: 16, y })
    .down()
    .pause(250)
    .move({ x: Math.floor(width * 0.82), y, duration: 700 })
    .up()
    .perform();

  if (await isShown(text('Catalog'))) {
    return;
  }

  await browser.execute('mobile: swipeGesture', {
    left: 0,
    top: Math.floor(height * 0.3),
    width: Math.floor(width * 0.85),
    height: Math.floor(height * 0.35),
    direction: 'right',
    percent: 0.9,
  });
}

/** Drag across an element with a W3C touch pointer. */
export async function dragAcross(element: WebdriverIO.Element): Promise<void> {
  const location = await element.getLocation();
  const size = await element.getSize();
  const startX = Math.floor(location.x + size.width * 0.2);
  const startY = Math.floor(location.y + size.height * 0.35);
  const endX = Math.floor(location.x + size.width * 0.8);
  const endY = Math.floor(location.y + size.height * 0.7);
  await browser
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: startX, y: startY })
    .down()
    .pause(120)
    .move({ x: endX, y: endY, duration: 600 })
    .up()
    .perform();
}

/**
 * UiAutomator2 long-click. Used on the drawing pad, which consumes the gesture
 * without navigating away.
 */
export async function longClickGesture(element: WebdriverIO.Element): Promise<void> {
  await browser.execute('mobile: longClickGesture', {
    elementId: element.elementId,
    duration: 1000,
  });
}
