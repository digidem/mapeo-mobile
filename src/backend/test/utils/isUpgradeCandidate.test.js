const test = require("tape");
const { isUpgradeCandidate } = require("../../lib/utils");
const fs = require("fs");
const path = require("path");

const validUpgradeCandidates = path.join(__dirname, "valid-upgrade-candidates");
const inValidUpgradeCandidates = path.join(
  __dirname,
  "invalid-upgrade-candidates"
);

test("isUpgradeCandidate: valid upgrade candidates", t => {
  const candidates = fs.readdirSync(validUpgradeCandidates);
  t.plan(candidates.length * 2);
  for (const candidate of candidates) {
    const config = fs.readFileSync(
      path.join(validUpgradeCandidates, candidate)
    );
    const json = JSON.parse(config);
    const res = isUpgradeCandidate(json);
    t.ok(
      res,
      `${candidate}: ${json.installer.versionName} is valid upgrade for ${json.currentApkInfo.versionName}`
    );
    const swap = isUpgradeCandidate({
      ...json,
      currentApkInfo: json.installer,
      installer: json.currentApkInfo,
    });
    t.false(
      swap,
      `${candidate} inverse: ${json.currentApkInfo.versionName} is invalid upgrade for ${json.installer.versionName}`
    );
  }
});

test("isUpgradeCandidate: invalid upgrade candidates; ", t => {
  const candidates = fs.readdirSync(inValidUpgradeCandidates);
  t.plan(candidates.length);
  for (const candidate of candidates) {
    const config = fs.readFileSync(
      path.join(inValidUpgradeCandidates, candidate)
    );
    const json = JSON.parse(config);
    const res = isUpgradeCandidate(json);
    t.false(
      res,
      `${candidate}: ${json.installer.versionName} is invalid upgrade for ${json.currentApkInfo.versionName}`
    );
  }
});
