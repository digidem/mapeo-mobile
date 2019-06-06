# Contributing

Thank you so much for taking the time to contribute to Mapeo development!
mapeo-mobile is a mobile app written in react-native that currently runs on
Android. For most development you will need the Android SDK installed on your
computer, but it is possible to contribute to UI Component development using the
storybook server.

## Initial Install

In order to start developing you will need git and node >=v8 installed on your
computer. For many development tasks you will also need the Android SDK
installed. Please use [yarn](https://yarnpkg.com/en/) to ensure that you get
deterministic builds and use the `yarn.lock` file.

```sh
git clone https://github.com/digidem/mapeo-mobile.git
cd mapeo-mobile
yarn
```

## Storybook

[Storybook](https://storybook.js.org) is a tool for developing React UI
components in isolation. You can see how a component renders with different
props as inputs, and changes you make to the code will update in realtime
through the storybook UI. What you see in the Storybook UI is defined by
"stories" which are in the [`src/stories`](src/stories) folder. You do not need
the Android SDK in order to develop with storybook. You can also run the
storybook app on an iOS (Apple) phone.

To install and run the app in storybook mode on a device:

```sh
cd storybook
yarn
yarn start
```

You can edit components and write new stories and see how components on-screen
render in isolation.

## Full App Development

### Pre-requisites

In order to develop the full app you will need the Android SDK installed and
[r19c of NDK](https://developer.android.com/ndk/guides/) in order to build
nodejs-mobile for Android.

You may need to open your app's `/android` folder in Android Studio, so that it detects, downloads and cofigures requirements that might be missing, like the NDK and CMake to build the native code part of the project.

You can also set the environment variable `ANDROID_NDK_HOME`, as in this example:

```sh
export ANDROID_NDK_HOME=/Users/username/Library/Android/sdk/ndk-bundle
```

### Testing Device

To use a real device, you will need to [enable USB
debugging](https://developer.android.com/studio/debug/dev-options) and connect
the phone to your computer with a USB cable. Enter `adb devices` in the terminal
to check that you can see the phone. You may need to unlock the phone screen and
say that you trust your computer in order for adb to connect.

You can also test Mapeo Mobile in an emulator. [Set up a virtual device in
Android Studio](https://developer.android.com/studio/run/managing-avds). Choose
`x86` as the `ABI`, since this will be much faster.

### Starting the dev version of Mapeo Mobile

Connect your phone with USB, or start up the emulator, then build and run the
dev version of the app on your device:

```sh
yarn android
```

You can configure the app to reload whenever you make a change: shake the device
to bring up the developer menu, and select "Enable Live Reload". Whenever you
change the code the app should reload. Changes to any code in the `src/frontend`
folder will appear immediately after a reload. If you change anything in
`src/backend` you will need to re-run `yarn android` in order to see changes.
If you are tired of shaking the phone you can enter `yarn dev-menu` from your
computer.

`yarn android` does two things: starts "Metro bundler" in one window, and
then builds and installs the dev version of Mapeo on the connected device. To
start Metro bundler on its own (e.g. if you already have the app installed), use
`yarn start`.

## Release Variants

We generate different variants of the app, each with a different Application ID,
which means each release variant has a separate data folder, and release
variants can be installed alongside each other.

### Dev / Debug Variant

During development the debug variant does not include bundled JS code from React
Native, instead it is loaded dynamically from Metro Bundler on the connected
computer. The debug variant has Application ID `com.mapeo.debug`. It has a
yellow logo.

### QA Variant

Alpha and Beta releases include a QA (Quality Assurance) variant, which is for
sharing internally for testing. We use a variant for this with a different
Application ID (`com.mapeo.qa`) so that the Dd field team can test new releases
alongside existing copies of the app on their phone. It has a red logo.

### Release Variant

This is the main variant of the app for our partners and the public. It has a
dark blue logo and Application ID `com.mapeo`.

## Releases & Builds

Mapeo is built using the CI service
[Bitrise](https://app.bitrise.io/app/288e6b3c3069b8e6). Every new commit
triggers an APK build, which is uploaded to Amazon S3. Git tags trigger
publishing of releases on Github and Google Play. Releases are managed using
[`standard-version`](https://github.com/conventional-changelog/standard-version)
with auto-generated changelogs based on commit messages that follow
[Conventional Commits Specification](https://conventionalcommits.org/).

### "Nightly" Internal Builds

These are created for every commit pushed to Github. They are uploaded the the
S3 bucket `mapeo-apks` for every commit. The filename of the apk is:

```
`date -u
+"%Y%m%d_%H%M%S"`_mapeo_qa_${GIT_COMMIT_SHA:0:7}_${BITRISE_BUILD_ID}.apk
```

These builds are available at http://mapeo-apks.ddem.us/?prefix=dev/

### Alpha Releases

To create an Alpha release:

```sh
yarn release:alpha
git push --follow-tags origin master
```

Alpha releases are created for git tags which match the pattern `v*-alpha*`.
They are uploaded to http://mapeo-apks.ddem.us/?prefix=qa/ and also published to
Github as a pre-release. Only a QA variant is built for Alpha releases. Alpha is
for internal testing and can be unstable.

### Beta Releases

To create a Beta release:

```sh
yarn release:beta
git push --follow-tags origin master
```

Beta releases are created for git tags which match the pattern `v*-beta*`. Both
QA and Release variants are built and published to
http://mapeo-apks.ddem.us/?prefix=qa/ and
http://mapeo-apks.ddem.us/?prefix=release/, and both are published to
https://github.com/digidem/mapeo-mobile/releases. The filenames of APKs from
beta releases published to Github as `Mapeo-QA-${GIT_TAG}.apk` and
`Mapeo-${GIT_TAG}.apk`. Beta release variants are also uploaded to [Google
Play](https://play.google.com/apps/publish/?account=7353212627880564314#AppDashboardPlace:p=com.mapeo&appid=4976023492261880835)
where Robo tests are run on different real devices, and are automatically
updated for any users who have signed up to the open beta track: https://play.google.com/apps/testing/com.mapeo

### Production Release

To create a Production release:

```sh
yarn release
git push --follow-tags origin master
```

Production releases are created for git tags that match the pattern `v*.*.*`.
They are uploaded to S3, Github Releases, and Google Play production track. No
QA variant is created for production releases.

## Troubleshooting

### `error: bundling failed: ReferenceError: Module not registered in graph`

If you see this error from the Metro Bundler it is most likely that you ran `yarn` and added modules when the Metro Bundler was already running (`yarn start`). Try quitting with bundler with `Ctrl-C` and then re-starting it with
`yarn start`. If that doesn't work also try restarting with a new cache with `yarn start --reset-cache`.

### `ENOSPC` Error in gradle build

If you see Android builds failing with an error like this:

```
Error: watch /bitrise/src/node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/views/picker/events ENOSPC
    at FSWatcher.start (fs.js:1382:19)
    at Object.fs.watch (fs.js:1408:11)
    at NodeWatcher.watchdir (/bitrise/src/node_modules/sane/src/node_watcher.js:159:22)
    at Walker.<anonymous> (/bitrise/src/node_modules/sane/src/common.js:109:31)
    at emitTwo (events.js:126:13)
    at Walker.emit (events.js:214:7)
    at /bitrise/src/node_modules/walker/lib/walker.js:69:16
    at go$readdir$cb (/bitrise/src/node_modules/graceful-fs/graceful-fs.js:162:14)
    at FSReqWrap.oncomplete (fs.js:135:15)
```

Then try [increasing the number of inotify
watchers](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers#the-technical-details)

```sh
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### App does not reload or install

Sometimes the connection through adb to the phone gets "stuck". Kill the adb
server, restart it, and connect the metro bundler with these steps:

```sh
adb kill-server
adb devices
adb reverse tcp:8081 tcp:8081
```

### Missing debug.keystore

Android Studio automatically creates a keystore for locally signing debug builds
`~/.android/debug.keystore`. You may not have this file if you have never used
Android Studio before. To create this keystore manually:

```
keytool -genkey -v -keystore ~/.android/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

This keystore is used to sign the debug builds of Mapeo Mobile. It should not be
used for signing any builds of Mapeo that will be shared with others. In order
to sign Mapeo for sharing you must use the private keystore that is encrypted in
this repo with git-secret.
