# Mapeo Mobile

An Android app for offline participatory mapping, by Digital Democracy.

## Contributing

This is a React Native project, making use of [react-native-node](https://github.com/staltz/react-native-node) for running a Node.js background process.

### Setup

- Make sure you have installed all React Native dependencies for Android development on your operating system, follow [these official instructions](http://facebook.github.io/react-native/docs/getting-started.html)
- `yarn` or `npm install` to install dependencies
- Have an Android device (not emulator, due to the Node.js background process built for ARM architectures) with developer mode enabled
- Acquire a MapBox access token (make an account and sign in) then insert the accessToken into the `env.json` file (not tracked in Git, but a skeleton is provided in the repo): `{"accessToken":"YOUR_MAPBOX_ACCESS_TOKEN"}`

### Developing

- Execute `npm run build-rnnodeapp` to compile the Node.js background project. It should create the folder `./rnnodeapp`
- `npm run android` will compile the Android/Java project and install the APK on the USB-connected device

#### Before commit (or in your editor config)

- Code style is maintained by [prettier](https://prettier.io/), set up editor integration or run `npm run prettier` before any commit
- Lint code with `npm run lint`
- Run type-checking with flow, start the server with `npm run flow start`, and check flow status with `npm run flow status`

### Debugging

- Install [react-native-debugger](https://github.com/jhen0409/react-native-debugger), kill Metro if you have it running, and start it with `npm run start:debugger` (this will start metro with the ENV set to launch the debugger)
- After launching the app with `npm run android` open react-native-debugger and on the phone open the dev menu (by shaking it) and enable remote debugging
- react-native debugger should show you redux actions, the react component heirarchy, and the console log and dev tools from Chrome.
- To debug the node process run logcat with `npm run logcat`. This will give you console and error output from rnnode. Note that when you make changes to anything in rnnode you will have to run `npm run build-rnnodeapp` *and* uninstall the debug app from the phone and reinstall with `npm run android`.

### Testing

Currently mapeo-mobile only supports component testing. All tests are put in `*.test.js` files right next to the script file being tested.

To run tests: `yarn test` (make sure you are not in `src/rnnodeapp`)

To update snapshots (necessary when you change UI): `yarn test -u` (make sure you are not in `src/rnnodeapp`)

### Generate Release APK

Download keystore using this link: https://drive.google.com/file/d/19Lx_Hir8mHVdI0MdtzSITpy5PDI-b8Hi/view?usp=sharing

Place keystore in `mapeo-mobile/android/app`

and then in `mapeo-mobile/android` run

```sh
./gradlew assembleRelease
```

### Benchmarks and low-level tests

Low-level library tests run a benchmarks-only background Node.js process in the Android device, and use Appium with `wd` to verify the results on-screen.

```sh
npm run benchmark
```

## Helpful Resources

- Enzyme Example: https://github.com/airbnb/enzyme#shallow-rendering
- Jest Snapshot Testing: https://facebook.github.io/jest/docs/en/snapshot-testing.html
