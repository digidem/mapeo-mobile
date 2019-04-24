# Contributing

Thank you so much for taking the time to contribute to Mapeo development!
mapeo-mobile is a mobile app written in react-native that currently runs on
Android. For most development you will need the Android SDK installed on your
computer, but it is possible to contribute to UI Component development using the
storybook server.

## Initial Install

In order to start developing you will need git and node >=v8 installed on your
computer. For many development tasks you will also need the Android SDK installed.

```sh
git clone https://github.com/digidem/mapeo-mobile.git
cd mapeo-mobile
npm install
```

## Storybook

[Storybook](https://storybook.js.org) is a tool for developing React UI
components in isolation. You can see how a component renders with different
props as inputs, and changes you make to the code will update in realtime
through the storybook UI. What you see in the Storybook UI is defined by
"stories" which are in the [`src/stories`](src/stories) folder.

### Storybook Web

The easiest way to get started without setting up your machine for mobile
development is to use Storybook web. It uses
[`react-native-web`](https://github.com/necolas/react-native-web) interally in
order to render react-native components in a browser. Note that layout and
colors do not appear exactly the same in the browser, and you may need to add
some additional styles to get things looking right. To start the storybook web
server:

```sh
npm run storybook-web
```

Your default browser should open with the Storybook interface. You can browse
different stories, and as you edit a component you will see your changes update
in real-time.

### Storybook Native

For a development environment that is closer to the actual app end-users will
see you can run storybook on a device or in the Android emulator. To install and
run the app in storybook mode on a device:

```sh
npm run android-storybook
```

Optionally you can also start a server that will give you a web interface to
control what you see on the mobile device:

```sh
npm run storybook-native
```

You can edit components and write new stories and see how components on-screen
render in isolation.

## Full App Development

In order to develop the full app you will need the Android SDK installed and
r19b of NDK in order to build nodejs-mobile for Android. To start up the
development version of the app on a device or in the emulator:

```sh
npm run android
```

You can configure the app to reload whenever you make a change: shake the device
to bring up the developer menu, and select "Enable Live Reload". Whenever you
change the code the app should reload.

## Troubleshooting

### `error: bundling failed: ReferenceError: Module not registered in graph`

If you see this error from the Metro Bundler it is most likely that you ran `npm install` and added modules when the Metro Bundler was already running (`npm start`). Try quitting with bundler with `Ctrl-C` and then re-starting it with
`npm start`. If that doesn't work also try restarting with a new cache with `npm start --reset-cache`.

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
