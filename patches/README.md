# Patches to `node_modules`

These patches use [`patch-package`](https://www.npmjs.com/package/patch-package)
to update dependencies which have unpublished fixes.

## [`lottie-react-native`](https://github.com/react-native-community/lottie-react-native)

Lottie does not work with [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated) Nodes, but we are using that for animating the intro screens.

This patch applies the changes from [PR #607](https://github.com/react-native-community/lottie-react-native/pull/607) which was not yet merged as of 2020-02-04.
