/* Component-level smoke for Gestures with a stubbed driver/element chain.
 * This is NOT iOS E2E; it validates call flow and stop conditions only.
 */
const assert = require('node:assert/strict');

function createDriverStub() {
  return {
    scrollCount: 0,
    actionsHistory: [],
    lastActions: null,
    pauseCount: 0,
    lastPauseMs: null,
    getWindowRect() {
      return { width: 1080, height: 1920 };
    },
    touchPerform(actions) {
      this.scrollCount += 1;
      this.lastActions = actions;
      this.actionsHistory.push(actions);
    },
    pause(ms) {
      this.pauseCount += 1;
      this.lastPauseMs = ms;
    },
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
  let thrown;
  try {
    Gestures.checkIfDisplayedWithScrollDown(element, maxScrolls);
  } catch (e) {
    threw = true;
    thrown = e;
  }
  console.log(`[smoke] ${name}: threw=${threw}, scrolls=${driver.scrollCount}`);
  if (expectThrow !== undefined) assert.equal(threw, expectThrow);
  if (expectScrolls !== undefined) assert.equal(driver.scrollCount, expectScrolls);
  if (expectThrow) {
    assert.ok(thrown && /could not be found or is not visible/.test(String(thrown.message)),
      'should throw the expected not visible error');
  }
  return { driver };
}

console.log('[smoke] Gestures component smoke start');

// Expected-correct behaviors
runCase('visible initially, budget 0', 0, 0, false, 0);
runCase('hidden always, budget 0', 0, Infinity, true, 0);
const r3 = runCase('visible on 2nd, budget 2', 2, 2, false, 2);
runCase('hidden always, budget 2', 2, Infinity, true, 2);
runCase('visible only on 3rd, budget 2', 2, 3, true, 2);

// Validate action sequence and coordinates for the last swipe of the 'visible on 2nd, budget 2' case
{
  const { driver } = r3;
  assert.equal(driver.pauseCount, 2, 'pause should be called once per swipe');
  assert.equal(driver.lastPauseMs, 1000, 'pause should be called with 1000ms');
  const actions = driver.lastActions;
  assert.ok(Array.isArray(actions) && actions.length === 4, 'should perform 4 touch actions');
  assert.equal(actions[0].action, 'press');
  assert.equal(actions[1].action, 'wait');
  assert.equal(actions[2].action, 'moveTo');
  assert.equal(actions[3].action, 'release');
  // Up swipe: same X, decreasing Y; coordinates are rounded integers
  const from = actions[0].options;
  const to = actions[2].options;
  assert.equal(typeof from.x, 'number');
  assert.equal(typeof from.y, 'number');
  assert.equal(from.x, to.x, 'X should be equal for vertical swipe up');
  assert.ok(to.y < from.y, 'should swipe upwards (to.y < from.y)');
  // With 1080x1920 screen and percentage 0.85, expected coords are:
  // start: x=1080*0.425=459, y=1920*0.7225=1387
  // end:   x=459, y=1920*0.1275=245
  assert.equal(from.x, 459);
  assert.equal(from.y, 1387);
  assert.equal(to.x, 459);
  assert.equal(to.y, 245);
}

console.log('[smoke] Gestures component smoke done');

