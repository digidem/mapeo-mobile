var wd = require('wd');
var path = require('path');
var test = require('tape');

var driver;

test('setup and open android app', function(t) {
  var serverConfig = { host: 'localhost', port: 4723 };
  driver = wd.promiseChainRemote(serverConfig);

  var desiredCapabilities = {
    browserName: 'android - local server',
    // 'appium-version': '1.7',
    // platformVersion: '7.1.1',
    platformName: 'Android',
    deviceName: 'Android device',
    app: path.resolve(
      __dirname,
      '../android/app/build/outputs/apk/app-benchmark-debug.apk'
    )
  };

  driver.init(desiredCapabilities).then(() => {
    t.end();
  });
});

test('displays texts "Tests", "Performance", "in progress..."x2', function(t) {
  var testsSelector = 'new UiSelector().textContains("Tests")';
  var performanceSelector = 'new UiSelector().textContains("Performance")';
  var inProgressSelector = 'new UiSelector().textContains("in progress...")';

  driver
    .waitForElementByAndroidUIAutomator(testsSelector, 8000)
    .then(el => t.ok(el, 'should have Tests title'))
    .then(() => driver.elementByAndroidUIAutomator(performanceSelector))
    .then(el => t.ok(el, 'should have Performance title'))
    .then(() => driver.elementsByAndroidUIAutomator(inProgressSelector))
    .then(els => t.equal(els.length, 2, 'should have two in-progress texts'))
    .then(() => t.end());
});

test('displays osm-p2p test results', function(t) {
  var testsSelector = 'new UiSelector().textContains("asserts")';
  var performanceSelector = 'new UiSelector().textContains("insert")';

  var expectedTests = {
    asserts: 2297,
    passes: 2297,
    failures: 0
  };

  var perfMaximumLimits = [
    { name: 'insert', total: 2500 },
    { name: 'index', total: 2000 },
    { name: 'small-query', total: 50 },
    { name: 'medium-query', total: 150 },
    { name: 'full-query', total: 500 },
    { name: 'replicate', total: 5000 },
    { name: 'total', total: 10000 },
  ];

  driver
    .waitForElementByAndroidUIAutomator(performanceSelector, 20000)
    .then(el => el.text())
    .then(text => JSON.parse(text))
    .then(perfResults => {
      perfMaximumLimits.forEach((maximumLimit, i) => {
        var res = perfResults[i];
        t.equal(res.name, maximumLimit.name, 'perf results have ' + res.name);
        t.true(
          res.total < maximumLimit.total,
          `${res.name} perf: ${res.total} < ${maximumLimit.total}`
        );
      })
      return;
    })
    .then(() => driver.waitForElementByAndroidUIAutomator(testsSelector, 20000))
    .then(el => el.text())
    .then(text =>
      t.equal(text, JSON.stringify(expectedTests), 'should pass all osm-p2p tests')
    )
    .then(() => t.end());
});

test('teardown', function(t) {
  driver.quit().then(() => {
    t.end();
  });
});
