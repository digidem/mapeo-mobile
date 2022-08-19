const fs = require("fs");
const path = require("path");
const process = require("process");

const packageVersion = require("../package.json").version;
const easConfigPath = path.resolve(__dirname, "../eas.json");
const easConfig = require(easConfigPath);

// Update this to the last known build number that we ran on Bitrise services before we start using this script
const BITRISE_BUILD_NUMBER = 1765;
const commitSha = process.env.GITHUB_SHA || "";

function getReleaseCandidateSuffix() {
  const ghBranchName = process.env.GITHUB_REF_NAME || "";
  const isReleaseCandidate =
    ghBranchName.startsWith("release/") || ghBranchName.startsWith("hotfix/");

  if (!isReleaseCandidate) return null;

  const buildNumberToUse =
    BITRISE_BUILD_NUMBER +
    500 +
    Number.parseInt(process.env.GITHUB_RUN_NUMBER || 0, 10);

  return `-RC+${commitSha.slice(0, 7)}.${buildNumberToUse}`;
}

const releaseCandidateSuffix = getReleaseCandidateSuffix();

const androidVersionName = `v${packageVersion}${releaseCandidateSuffix || ""}`;

const updatedEasConfig = JSON.stringify(
  {
    ...easConfig,
    build: {
      ...easConfig.build,
      release: {
        ...easConfig.build.release,
        env: {
          ANDROID_VERSION_NAME: androidVersionName,
        },
      },
    },
  },
  null,
  2
);

console.log("Setting ANDROID_VERSION_NAME to", androidVersionName);

fs.writeFileSync(easConfigPath, updatedEasConfig, null, 2);
