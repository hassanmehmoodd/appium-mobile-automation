import { CatalogScreen } from '../../../src/screens/CatalogScreen.js';
import { saveDocScreenshot } from '../../../src/support/docs.js';
import { catalog } from '../../../src/support/fixtures.js';

describe('Sorting', () => {
  it('sorts the catalog by ascending price @regression', async () => {
    const catalogScreen = new CatalogScreen();
    await catalogScreen.waitForLoaded();
    await catalogScreen.openSort();
    await catalogScreen.chooseSort('Ascending order by price');

    await browser.waitUntil(
      async () => (await catalogScreen.firstProductTitle()) === catalog.priceAscendingFirst.name,
      {
        timeout: 15_000,
        timeoutMsg: `Expected ${catalog.priceAscendingFirst.name} to be first`,
      },
    );
    await saveDocScreenshot('07-sort-price-ascending');
  });

  it('sorts the catalog by descending name @regression', async () => {
    const catalogScreen = new CatalogScreen();
    await catalogScreen.waitForLoaded();
    await catalogScreen.openSort();
    await catalogScreen.chooseSort('Descending order by name');

    await browser.waitUntil(
      async () => (await catalogScreen.firstProductTitle()) === catalog.nameDescendingFirst.name,
      {
        timeout: 15_000,
        timeoutMsg: `Expected ${catalog.nameDescendingFirst.name} to be first`,
      },
    );
  });
});
