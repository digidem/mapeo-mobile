const test = require("tape");
const { isUpgradeCandidate } = require("../../lib/utils");
const fakeApkInfo = require("../fixtures/fake-apk-info");

test("1.0.0 should update to 1.0.1 and 1.2.0 but not to 1.0.0-RC", t => {
  t.plan(3);
  const deviceInfo = {
    supportedAbis: fakeApkInfo.v1_0_0.arch,
    sdkVersion: 1,
  };
  const currentApkInfo = fakeApkInfo.v1_0_0;
  const res101 = isUpgradeCandidate({
    deviceInfo: deviceInfo,
    currentApkInfo: currentApkInfo,
    installer: fakeApkInfo.v1_0_1,
  });
  t.ok(res101);
  const res120 = isUpgradeCandidate({
    deviceInfo: deviceInfo,
    currentApkInfo: currentApkInfo,
    installer: fakeApkInfo.v1_2_0,
  });
  t.ok(res120);
  const res100RC = isUpgradeCandidate({
    deviceInfo: deviceInfo,
    currentApkInfo: currentApkInfo,
    installer: fakeApkInfo.v1_0_0_RC,
  });
  t.false(res100RC);
});
