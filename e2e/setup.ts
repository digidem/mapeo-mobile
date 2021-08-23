/* eslint-env detox/detox, jest/globals */

beforeAll(async () => {
  await device.launchApp();
  await device.setURLBlacklist([".*api.mapbox.com.*"]);
});
