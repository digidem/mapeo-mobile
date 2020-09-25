/* eslint-env detox/detox, jest/globals */

const { byId, byText } = require("./matcher");

const actionMethods = [
  "tap",
  "multiTap",
  "longPress",
  "swipe",
  "pinch",
  "scroll",
  "scrollTo",
  "typeText",
  "replaceText",
  "clearText",
  "tapReturnKey",
  "tapBackSpace",
];

// Wait for an element to be visible. Returns a promise with same methods as element
const waitForVisible = (el, timeout = 5000) => {
  const waitForPromise = waitFor(el).toBeVisible().withTimeout(timeout);
  for (const actionName of actionMethods) {
    waitForPromise[actionName] = async (...args) => {
      return el[actionName].apply(el, args);
    };
  }
  return waitForPromise;
};
const waitForMap = async () => {
  await waitForVisible(byId("mapboxMapView"));
};
const waitForCamera = async () => {
  await waitForVisible(byId("camera"));
};
const tapMapAddButton = async () => {
  await waitForVisible(byId("addButtonMap")).tap();
};
const tapCameraAddButton = async () => {
  await waitForVisible(byId("addButtonCamera")).tap();
};
const tapGpsPill = async () => await byId("gpsPillButton").tap();
const switchToCameraTab = async () => {
  await waitForVisible(byId("tabBarButtonCamera")).tap();
};
const switchToMapTab = async () => {
  await waitForVisible(byId("tabBarButtonMap")).tap();
};
const navigateToObservationList = async () => {
  await waitForVisible(byId("observationListButton")).tap();
};
const navigateToSettings = async () => {
  await navigateToObservationList();
  await waitForVisible(byId("settingsButton")).tap();
};

describe("Mapeo", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe("Initial load & home screen", () => {
    test("Shows map when app loads", async () => {
      await waitForMap();
      await expect(byId("mapboxMapView")).toBeVisible();
    });

    test("Touching tab bar icons switches between map & camera", async () => {
      await switchToCameraTab();
      await waitForCamera();
      await expect(byId("camera")).toBeVisible();
      await switchToMapTab();
      await waitForMap();
      await expect(byId("mapboxMapView")).toBeVisible();
    });
  });

  describe("Settings", () => {
    test("Clicking observation list then settings icon shows settings screen", async () => {
      await navigateToSettings();
      await expect(byId("settingsList")).toBeVisible();
    });

    test("Changing language in settings changes app language", async () => {
      await navigateToSettings();
      await byId("settingsLanguageButton").tap();
      await waitFor(byId("esLanguageButton"))
        .toBeVisible()
        .whileElement(by.id("languageScrollView"))
        .scroll(100, "down");
      await byId("esLanguageButton").tap();
      await navigateToObservationList();
      await expect(byText("Observaciones")).toBeVisible();
      // Delete and re-install the app after changing language, so that it
      // resets to the default language
      await device.launchApp({ delete: true });
    });
  });

  describe("Create observation", () => {
    test("Tapping add from map screen shows 'choose what is happening' screen", async () => {
      await tapMapAddButton();
      await expect(byText("Choose what is happening")).toBeVisible();
    });

    // expo-camera does not work in an emulator see
    // https://github.com/expo/expo/issues/5529
    test.skip("Tapping add from camera screen shows 'choose what is happening' screen", async () => {
      await switchToCameraTab();
      await tapCameraAddButton();
      // Need to wait for this screen because the camera shutter button is async
      // and does not switch screens until the photo is taken
      await waitForVisible(byText("Choose what is happening"), 10000);
      await expect(byText("Choose what is happening")).toBeVisible();
    });
  });

  describe("GPS", () => {
    test("Clicking GPS pill shows GPS screen", async () => {
      await tapGpsPill();
      await expect(byText("Current GPS Location")).toBeVisible();
      await expect(byId("gpsScreenScrollView")).toBeVisible();
    });
  });
});

// function sleep(milliseconds) {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// }
