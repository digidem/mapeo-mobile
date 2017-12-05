# Mapeo Mobile

An Android app for offline participatory mapping, by Digital Democracy.

## Contributing

This is a React Native project, making use of [react-native-node](https://github.com/staltz/react-native-node) for running a Node.js background process.

### Setup

- Make sure you have installed all React Native dependencies for Android development on your operating system, follow [these official instructions](http://facebook.github.io/react-native/docs/getting-started.html)
- `yarn` to install dependencies
- Have an Android device (not emulator, due to the Node.js background process built for ARM architectures) with developer mode enabled

### Compile

- Execute `npm run build-rnnodeapp` to compile the Node.js background project. It should create the folder `./rnnodeapp`
- `npm run android` will compile the Android/Java project and install the APK on the USB-connected device

### Benchmarks and low-level tests

Low-level library tests run a benchmarks-only background Node.js process in the Android device, and use Appium with `wd` to verify the results on-screen.

```
npm run benchmark
```
