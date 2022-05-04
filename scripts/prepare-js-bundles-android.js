#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const bundleAssetName = "index.android.bundle";
const projectRoot = path.resolve(__dirname, "..");
const androidDir = path.join(projectRoot, "android");
const buildDir = path.join(androidDir, "app/build");
const jsBundleRoot = path.join(buildDir, "generated/assets/react/");
const resourcesRoot = path.join(buildDir, "generated/res/react/");
const jsSourceMapsRoot = path.join(buildDir, "generated/sourcemaps/react");

const flavors = ["app", "icca", "qa"];
const buildTypes = ["release", "intel", "universal"];

(async () => {
  // First of all, make sure all the destination directories exist
  const createDirsPromises = [];
  for (const flavor of flavors) {
    for (const buildType of buildTypes) {
      createDirsPromises.push([
        mkdirp(path.join(jsBundleRoot, flavor, buildType)),
        mkdirp(path.join(resourcesRoot, flavor, buildType)),
        mkdirp(path.join(jsSourceMapsRoot, flavor, buildType)),
      ]);
    }
  }
  await Promise.all(createDirsPromises);
  console.log("Created directories for bundle output");

  // The react native gradle build script creates a separate JavaScript bundle
  // for each flavor and build type combination. For Mapeo Mobile all bundles
  // are the same except for the `icca` flavor, which includes the ICCA specific
  // code. We generate bundles for the `app` and `icca` flavors and then copy
  // bundles and resources across for the other variants, so we avoid the extra
  // build time of generating all the extra bundles
  for (const flavor of ["app", "icca"]) {
    const targetPath = `${flavor}/release/`;
    const jsBundleDir = path.join(jsBundleRoot, targetPath);
    const jsBundleFile = path.join(jsBundleDir, bundleAssetName);
    const resourcesDir = path.join(resourcesRoot, targetPath);
    const jsSourceMapsDir = path.join(jsSourceMapsRoot, targetPath);
    const jsOutputSourceMapFile = path.join(
      jsSourceMapsDir,
      bundleAssetName + ".map"
    );

    console.log(`Generating bundle for '${flavor}' flavor`);
    const {
      stdout,
    } = await exec(
      `RN_SRC_EXT=${flavor} react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output ${jsBundleFile} --sourcemap-output ${jsOutputSourceMapFile} --assets-dest ${resourcesDir}`,
      { cwd: projectRoot }
    );
    console.log(stdout);
    console.log(`Created bundle for '${flavor}' flavor`);
  }
  console.log("Bundle generation complete");

  // Copy across the app and icca flavor bundles to all the other
  // flavor/buildType variants
  const copyPromises = [];
  for (const flavor of flavors) {
    for (const buildType of buildTypes) {
      if (flavor === "icca" && buildType === "release") continue;
      if (flavor === "app" && buildType === "release") continue;
      const sourcePath = flavor === "icca" ? "icca/release" : "app/release";
      const targetPath = `${flavor}/${buildType}`;
      copyPromises.push([
        fs.copy(
          path.join(jsBundleRoot, sourcePath, bundleAssetName),
          path.join(jsBundleRoot, targetPath, bundleAssetName)
        ),
        fs.copy(
          path.join(jsSourceMapsRoot, sourcePath, bundleAssetName + ".map"),
          path.join(jsSourceMapsRoot, targetPath, bundleAssetName + ".map")
        ),
        fs.copy(
          path.join(resourcesRoot, sourcePath),
          path.join(resourcesRoot, targetPath)
        ),
      ]);
    }
  }
  await Promise.all(copyPromises);
  console.log("Bundle copy complete");

  // Run gradle tasks to copy the bundled Js and Assets into the correct
  // folders, but skip the bundle tasks (because we already generated our
  // bundles above)
  console.log("Running gradle copyBundledJs tasks");
  const gradleTasks = [];
  const gradleExcludeTasks = [];
  for (const flavor of flavors) {
    for (const buildType of buildTypes) {
      // We ignore this variant in our build.gradle, so need to skip it here
      if (flavor === "qa" && buildType === "universal") continue;
      const variantName = `${capitalize(flavor)}${capitalize(buildType)}`;
      gradleTasks.push(`copy${variantName}BundledJs`);
      gradleExcludeTasks.push(`-x bundle${variantName}JsAndAssets`);
    }
  }
  const gradleCommand = [...gradleTasks, ...gradleExcludeTasks].join(" ");
  const { stdout } = await exec(`./gradlew ${gradleCommand}`, {
    cwd: androidDir,
  });
  console.log(stdout);
  console.log("Gradle copyBundledJs tasks complete");
})();

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
