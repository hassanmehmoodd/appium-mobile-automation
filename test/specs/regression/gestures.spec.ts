import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { DrawingScreen } from '../../../src/screens/DrawingScreen.js';
import { ProductScreen } from '../../../src/screens/ProductScreen.js';
import {
  scrollGesture,
  scrollUntilVisible,
  swipeOpenDrawer,
} from '../../../src/support/gestures.js';
import { text } from '../../../src/support/selectors.js';
import { isShown } from '../../../src/support/visibility.js';

describe('Gestures', () => {
  it('opens the navigation drawer with an edge swipe @regression', async () => {
    const catalog = new CatalogScreen();
    await catalog.waitForLoaded();
    await swipeOpenDrawer();
    await expect($(text('Catalog'))).toBeDisplayed();
    await expect($('~Login Menu Item')).toBeDisplayed();
  });

  it('scrolls the catalog with a mobile scroll gesture @regression', async () => {
    const target = 'Sauce Labs Onesie';
    const catalog = new CatalogScreen();
    await catalog.waitForLoaded();
    const before = await catalog.firstProductTitle();
    await expect(await isShown(text(target))).toBe(false);

    await scrollGesture('down');
    await expect($('~View menu')).toBeDisplayed();
    await scrollUntilVisible(target);

    await expect($(text(target))).toBeDisplayed();
    await expect(await catalog.firstProductTitle()).not.toBe(before);
  });

  it('long-presses a rating star and opens the review dialog @regression', async () => {
    const catalog = new CatalogScreen();
    await catalog.waitForLoaded();
    await catalog.openProduct('Sauce Labs Backpack');

    const product = new ProductScreen();
    await product.waitForName('Sauce Labs Backpack');
    await product.longPressFirstStar();
    await product.expectReviewDialog();
    await product.closeReview();
    await expect($(text('Sauce Labs Backpack'))).toBeDisplayed();
  });

  it('drags and long-clicks the drawing pad @regression', async () => {
    const catalog = new CatalogScreen();
    await catalog.waitForLoaded();
    const menu = await catalog.openMenu();
    await menu.openDrawing();

    const drawing = new DrawingScreen();
    await drawing.waitForLoaded();
    await drawing.drawAndHold();
    await expect($(text('Drawing'))).toBeDisplayed();
    await drawing.save();
  });
});
