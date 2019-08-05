# Patches to `node_modules`

These patches use [`patch-package`](https://www.npmjs.com/package/patch-package)
to update dependencies which have unpublished fixes.

## `@react-native-mapbox-gl/maps`

The build was failing due to AndroidX / jetifier issues. This fix is pending
https://github.com/react-native-mapbox-gl/maps/pull/251

## `@unimodules/react-native-adapter@2.0.1`

The build was failing with an error "Unable to resolve dependency for
':unimodules-react-native-adapter@debug/compileClasspath'". The solution in
https://github.com/unimodules/react-native-unimodules/issues/52#issuecomment-503495466
fixed the builds.

## `metro`

Builds were throwing an error:

```
android/app/src/main/res/raw/package.json: Error: package is not a valid resource name (reserved Java keyword)
```

This was due to mapeo-mobile code requiring `package.json` (which is used to get
the version number). This fix is pending
https://github.com/facebook/metro/pull/420
