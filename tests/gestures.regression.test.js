// Node.js built-in test runner
const { test } = require('node:test');
const assert = require('node:assert/strict');

function createDriverStub() {
  return {
    scrollCount: 0,
    getWindowRect() {
      return { width: 1080, height: 1920 };
    },
    touchPerform(actions) {
      // Count each swipe invocation
      this.scrollCount += 1;
      this.lastActions = actions;
    },
    pause() {
      // no-op for tests
    },
  };
}

function createElementStub(driver, options) {
  const { visibleFromScroll = Infinity, exists = true } = options || {};
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

test('already visible with budget 0 -> success, 0 scrolls', () => {
  const driver = createDriverStub();
  global.driver = driver;
  delete require.cache[require.resolve('../commons/Gestures')];
  const Gestures = require('../commons/Gestures');
  const element = createElementStub(driver, { visibleFromScroll: 0 });

  assert.doesNotThrow(() => {
    Gestures.checkIfDisplayedWithScrollDown(element, 0);
  });
  assert.equal(driver.scrollCount, 0, 'should not scroll when already visible and budget=0');
});

test('always hidden with budget 0 -> throws, 0 scrolls', () => {
  const driver = createDriverStub();
  global.driver = driver;
  delete require.cache[require.resolve('../commons/Gestures')];
  const Gestures = require('../commons/Gestures');
  const element = createElementStub(driver, { visibleFromScroll: Infinity });

  let threw = false;
  let err;
  try {
    Gestures.checkIfDisplayedWithScrollDown(element, 0);
  } catch (e) {
    threw = true;
    err = e;
  }
  assert.equal(threw, true, 'should throw when hidden and budget=0');
  assert.ok(/could not be found or is not visible/.test(String(err && err.message)),
    'should throw the expected not visible error');
  // EXPECTED CORRECT BEHAVIOR: 0 scrolls. Master overscrolls by 1 (known bug).
  assert.equal(driver.scrollCount, 0, 'should not scroll when budget=0');
});

test('becomes visible on 2nd scroll with budget 2 -> success, 2 scrolls', () => {
  const driver = createDriverStub();
  global.driver = driver;
  delete require.cache[require.resolve('../commons/Gestures')];
  const Gestures = require('../commons/Gestures');
  const element = createElementStub(driver, { visibleFromScroll: 2 });

  assert.doesNotThrow(() => {
    Gestures.checkIfDisplayedWithScrollDown(element, 2);
  });
  assert.equal(driver.scrollCount, 2, 'should scroll exactly twice and then succeed');
});

test('always hidden with budget 2 -> throws, 2 scrolls', () => {
  const driver = createDriverStub();
  global.driver = driver;
  delete require.cache[require.resolve('../commons/Gestures')];
  const Gestures = require('../commons/Gestures');
  const element = createElementStub(driver, { visibleFromScroll: Infinity });

  let threw = false;
  let err;
  try {
    Gestures.checkIfDisplayedWithScrollDown(element, 2);
  } catch (e) {
    threw = true;
    err = e;
  }
  assert.equal(threw, true, 'should throw when hidden after exhausting budget=2');
  assert.ok(/could not be found or is not visible/.test(String(err && err.message)),
    'should throw the expected not visible error');
  // EXPECTED CORRECT BEHAVIOR: 2 scrolls. Master overscrolls to 3 (known bug).
  assert.equal(driver.scrollCount, 2, 'should scroll at most budget times (2)');
});

test('visible only on 3rd scroll with budget 2 -> throws, 2 scrolls (no 3rd attempt)', () => {
  const driver = createDriverStub();
  global.driver = driver;
  delete require.cache[require.resolve('../commons/Gestures')];
  const Gestures = require('../commons/Gestures');
  // Would become visible on 3rd scroll, but budget is 2, so must fail without 3rd swipe
  const element = createElementStub(driver, { visibleFromScroll: 3 });

  let threw = false;
  let err;
  try {
    Gestures.checkIfDisplayedWithScrollDown(element, 2);
  } catch (e) {
    threw = true;
    err = e;
  }
  assert.equal(threw, true, 'should throw because visibility requires > budget scrolls');
  assert.ok(/could not be found or is not visible/.test(String(err && err.message)),
    'should throw the expected not visible error');
  assert.equal(driver.scrollCount, 2, 'should not perform a 3rd scroll beyond budget');
});

