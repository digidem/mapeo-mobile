# Patches to `node_modules`

These patches use [`patch-package`](https://www.npmjs.com/package/patch-package)
to update dependencies which have unpublished fixes.

## `nodejs-mobile-react-native`

This patch additionally extracts files in the folder `assets/nodejs-assets` so
that they can be accessed by the nodejs process. This is necessary so that
different variants (Mapeo for ICCAs vs normal Mapeo) can each ship their own
assets (e.g. presets)
