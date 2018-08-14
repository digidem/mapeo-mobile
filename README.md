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
- **IMPORTANT: rnnodeapp changes:** If you change any code within `./rnnodeapp` you will need to re-run `npm run build-rnnodeapp` **AND** at least quit and re-run `npm run android` and if the app is still not updating, uninstall it and re-install.

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

### Decrypt Keystore for APK signing

The APK needs to be signed to be installed on the phone (non-debug version) and released on the Play Store. All releases must be signed with the same keys, otherwise the user will need to uninstall and loose all their data in order to install a new version. The keystore is included in this repo encrypted with pgp using [`git-secret`](http://git-secret.io/). In order to decrypt it you need to create a gpg key-pair and an authorised user (e.g. gmaclennan@digital-democracy.org) needs to add your public key to `git-secret`. Then you can decrypt the keystore into the correct location (`android/app/my-release-key.keystore`)

#### 1. Create a new GPG keypair

1. Install GnuPG, on mac this is easiest if you install [homebrew](https://brew.sh/) and then run `brew install gpg`
2. Create a gpg keypair if you don't have one already `gpg --gen-key` (you can generally accept the defaults)
3. Export your public key to a file `gpg --export -a "email@example.com" > public.key
` (use the email you used to generate the keypair)
4. Send your public key to an existing authorized user (e.g. gmaclennan@digital-democracy.org)

#### Install git-secret

Follow the instructions on [gitsecret.io](http://git-secret.io/installation), on a mac: `brew install git-secret`.

#### Add a user to git-secret

This will enable a user to decrypt the keystore. You will need to have the users public key file (e.g. `users-public-key.key`) and you will need to already be authorized.

1. Import the users public key into your gpg: `gpg --import users-public-key.key` (replace the key name with a path to the public key file from the user)
2. Now add this person to the `git-secret` by running `git secret tell persons@email.id`
3. Reencrypt the files, now they will be able to decrypt them with their secret key: `git secret hide`

#### Decrypt the keystore

Run `git secret reveal`. It will ask you for your gpg private key password. They keystore will be decrypted to `android/app/my-release-key.keystore`. You're done! Phew.

### Generate Release APK

Make sure you have decrypted the keystore my following the instructions above, the make sure the node app is up to date:

```sh
npm run build-rnnodeapp
cd android
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
