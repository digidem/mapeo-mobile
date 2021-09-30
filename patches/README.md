# Patches to `node_modules`

These patches use [`patch-package`](https://www.npmjs.com/package/patch-package)
to update dependencies which have unpublished fixes.

## `nodejs-mobile-react-native`

### Extract nodejs-assets

Patch to additionally extracts files in the folder `assets/nodejs-assets` so
that they can be accessed by the nodejs process. This is necessary so that
different variants (Mapeo for ICCAs vs normal Mapeo) can each ship their own
assets (e.g. presets)

### Use prebuilt toolchain

Patch the build process to use the prebuilt toolchain that is now included in NDK, rather than build the toolchain as part of the build process. This increases build speed and avoids errors trying to build the toolchain.

### Specify NDK version

`nodejs-mobile-react-native` seems to fail with NDK version 22 and 23. The patch specifies the NDK version in the `nodejs-mobile-react-native` `build.gradle`.

## `react-native`

This patch adds an environment variable `APP_VARIANT` with the app variant name
when calling `react-native bundle` in the react gradle script. This is used to
define custom `sourceExts` for Metro bundler, so we can package specific code
based on application variant. It is necessary to patch this file rather than
just add an environment variable as part of the build script because it allows
gradle tasks like `./gradlew assembleRelease` to work as expected — each variant
will be built correctly with the correct bundled files.
