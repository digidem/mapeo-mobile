var wd = require('wd');
var path = require('path');
var test = require('tape');

var lastArg = process.argv.length - 1;
var ciMode = process.argv[lastArg] === 'ci';

var browserStackConfig = 'http://hub-cloud.browserstack.com/wd/hub';
var localServerConfig = { host: 'localhost', port: 4723 };

var browserStackCapabilities = {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
    'build': 'Benchmark Android',
    'name': 'session_' +
      (new Date(Date.now()))
      .toISOString()
      .substr(0,16)
      .replace(/\-|T|\:/g,'_'),
    'device' : 'Google Pixel',
    'app': process.env.BROWSERSTACK_APP_URL,
    'browserstack.debug': true
}
var localCapabilities = {
  browserName: 'Android - local server',
  platformName: 'Android',
  deviceName: 'Android device',
  app: path.resolve(
    __dirname,
    '../android/app/build/outputs/apk/app-benchmark-debug.apk'
  )
};

var driver;

test('setup and open android app', function(t) {
  var serverConfig = ciMode ? browserStackConfig : localServerConfig;
  var capabilities = ciMode ? browserStackCapabilities : localCapabilities;

  driver = wd.promiseChainRemote(serverConfig);
  driver.init(capabilities).then(() => {
    t.end();
  });
});

test('displays texts "Tests", "Performance", "in progress..."x2', function(t) {
  var testsSelector = 'new UiSelector().textContains("Tests")';
  var performanceSelector = 'new UiSelector().textContains("Performance")';
  var inProgressSelector = 'new UiSelector().textContains("in progress...")';

  driver
    .waitForElementByAndroidUIAutomator(testsSelector, 90000)
    .then(el => t.ok(el, 'should have Tests title'))
    .then(() => driver.elementByAndroidUIAutomator(performanceSelector))
    .then(el => t.ok(el, 'should have Performance title'))
    .then(() => driver.elementsByAndroidUIAutomator(inProgressSelector))
    .then(els => t.equal(els.length, 2, 'should have two in-progress texts'))
    .then(() => t.end());
});

test('displays osm-p2p test results', function(t) {
  var testsResultsSelector = 'new UiSelector().textContains("asserts")';
  var perfResultsSelector = 'new UiSelector().textContains("insert")';

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
    .waitForElementByAndroidUIAutomator(perfResultsSelector, 90000)
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
    .then(() => driver.waitForElementByAndroidUIAutomator(testsResultsSelector, 90000))
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
