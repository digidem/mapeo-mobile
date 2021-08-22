module.exports = {
  testRunner: "jest",
  // Optional. This field tells detox test CLI where to look for Jest's config
  // file. If omitted, the default value is e2e/config.json.
  runnerConfig: "e2e/config.json",
  // Optional. This field tells detox test to stop appending --maxWorkers 1
  // argument to jest ... command by default. Since detox@18.19.0, the control
  // over maxWorkers count has been transfered to Jest config files, and that
  // allows you to set any other value as a default maxWorkers count.
  skipLegacyWorkersInjection: true,
  devices: {
    "android.emulator": {
      type: "android.emulator",
      device: {
        avdName: "emu",
      },
      utilBinaryPaths: ["./.cache/test-butler-app.apk"],
    },
    "android.attached": {
      type: "android.attached",
      device: {
        adbName: "*",
      },
    },
    "ios.simulator": {
      type: "ios.simulator",
      device: {
        type: "iPhone 6s",
      },
    },
  },
  apps: {
    "android.release": {
      type: "android.apk",
      binaryPath:
        "android/app/build/outputs/apk/app/universal/mapeo-app-universal.apk",
      build:
        "cd android && ./gradlew --scan --no-daemon app:assembleUniversal app:assembleAndroidTest -DtestBuildType=universal && cd ..",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/app/debug/mapeo-app-debug.apk",
      build:
        "cd android && ./gradlew app:assembleDebug app:assembleAndroidTest -DtestBuildType=debug && cd ..",
    },
    "ios.release": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Release-iphonesimulator/mapeo.app",
      build:
        "xcodebuild -project ios/mapeo.xcodeproj -scheme mapeo -configuration Release -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "ios.debug": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/mapeo.app",
      build:
        "xcodebuild -project ios/mapeo.xcodeproj -scheme mapeo -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
  },
  configurations: {
    "android.emu.debug": {
      device: "android.emulator",
      app: "android.debug",
    },
    "android.device.debug": {
      device: "android.attached",
      app: "android.debug",
    },
    "android.emu.release": {
      device: "android.emulator",
      app: "android.release",
    },
    "ios.sim.debug": {
      device: "ios.simulator",
      app: "ios.debug",
    },
    "ios.sim.release": {
      device: "ios.simulator",
      app: "ios.release",
    },
  },
};
