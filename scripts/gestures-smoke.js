/* Component-level smoke for Gestures with a stubbed driver/element chain.
 * This is NOT iOS E2E; it validates call flow and stop conditions only.
 */
const assert = require('node:assert/strict');

function createDriverStub() {
  return {
    scrollCount: 0,
    getWindowRect() {
      return { width: 1080, height: 1920 };
    },
    touchPerform() {
      this.scrollCount += 1;
    },
    pause() {},
  };
}

function createElementStub(driver, { visibleFromScroll = Infinity, exists = true } = {}) {
  return {
    isExisting() {
      return exists;
    },
    isDisplayed() {
      return driver.scrollCount >= visibleFromScroll;
    },
    toString() {
      return `Element(visibleFromScroll=${visibleFromScroll}, exists=${exists})`;
    },
  };
}

function runCase(name, maxScrolls, visibleFromScroll, expectThrow, expectScrolls) {
  const driver = createDriverStub();
  global.driver = driver;
  delete require.cache[require.resolve('../commons/Gestures')];
  const Gestures = require('../commons/Gestures');
  const element = createElementStub(driver, { visibleFromScroll });
  let threw = false;
  try {
    Gestures.checkIfDisplayedWithScrollDown(element, maxScrolls);
  } catch (e) {
    threw = true;
  }
  console.log(`[smoke] ${name}: threw=${threw}, scrolls=${driver.scrollCount}`);
  if (expectThrow !== undefined) assert.equal(threw, expectThrow);
  if (expectScrolls !== undefined) assert.equal(driver.scrollCount, expectScrolls);
}

console.log('[smoke] Gestures component smoke start');

// Expected-correct behaviors
runCase('visible initially, budget 0', 0, 0, false, 0);
runCase('hidden always, budget 0', 0, Infinity, true, 0);
runCase('visible on 2nd, budget 2', 2, 2, false, 2);
runCase('hidden always, budget 2', 2, Infinity, true, 2);
runCase('visible only on 3rd, budget 2', 2, 3, true, 2);

console.log('[smoke] Gestures component smoke done');

