# Patches to `node_modules`

These patches use [`patch-package`](https://www.npmjs.com/package/patch-package)
to update dependencies which have unpublished fixes.

## `nodejs-mobile-react-native`

This patch additionally extracts files in the folder `assets/nodejs-assets` so
that they can be accessed by the nodejs process. This is necessary so that
different variants (Mapeo for ICCAs vs normal Mapeo) can each ship their own
assets (e.g. presets)

## `react-native`

This patch adds an environment variable `APP_VARIANT` with the app variant name
when calling `react-native bundle` in the react gradle script. This is used to
define custom `sourceExts` for Metro bundler, so we can package specific code
based on application variant. It is necessary to patch this file rather than
just add an environment variable as part of the build script because it allows
gradle tasks like `./gradlew assembleRelease` to work as expected — each variant
will be built correctly with the correct bundled files.
