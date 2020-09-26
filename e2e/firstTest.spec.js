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

describe("Mapeo", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe("Initial load & home screen", () => {
    test("Shows map when app loads", async () => {
      await expect(byId("mapboxMapView")).toBeVisible();
    });

    test("Touching tab bar icons switches between map & camera", async () => {
      await byId("tabBarButtonCamera").tap();
      await expect(byId("camera")).toBeVisible();
      await byId("tabBarButtonMap").tap();
      await expect(byId("mapboxMapView")).toBeVisible();
    });
  });

  describe("Settings", () => {
    test("Clicking observation list then settings icon shows settings screen", async () => {
      await byId("observationListButton").tap();
      await byId("settingsButton").tap();
      await expect(byId("settingsList")).toBeVisible();
    });

    test("Changing language in settings changes app language", async () => {
      await byId("observationListButton").tap();
      await byId("settingsButton").tap();
      await byId("settingsLanguageButton").tap();
      await waitFor(byId("esLanguageButton"))
        .toBeVisible()
        .whileElement(by.id("languageScrollView"))
        .scroll(100, "down");
      await byId("esLanguageButton").tap();
      // In e2e test env, when the app reloads (which is what happens when you
      // change language) the navigation state is lost and we return to the map
      // screen. In production navigation state is persisted and changing
      // language stays on the same screen
      await byId("observationListButton").tap();
      await expect(byText("Observaciones")).toBeVisible();
      // Delete and re-install the app after changing language, so that it
      // resets to the default language
      await device.launchApp({ delete: true });
    });
  });

  describe("Create observation", () => {
    test("Tapping add from map screen shows 'choose what is happening' screen", async () => {
      await byId("addButtonMap").tap();
      await expect(byText("Choose what is happening")).toBeVisible();
    });

    // expo-camera does not work in an emulator see
    // https://github.com/expo/expo/issues/5529
    test.skip("Tapping add from camera screen shows 'choose what is happening' screen", async () => {
      await byId("tabBarButtonCamera").tap();
      await byId("addButtonCamera").tap();
      // Need to wait for this screen because the camera shutter button is async
      // and does not switch screens until the photo is taken
      await waitForVisible(byText("Choose what is happening"), 10000);
      await expect(byText("Choose what is happening")).toBeVisible();
    });
  });

  describe("GPS", () => {
    test("Clicking GPS pill shows GPS screen", async () => {
      await byId("gpsPillButton").tap();
      await expect(byText("Current GPS Location")).toBeVisible();
      await expect(byId("gpsScreenScrollView")).toBeVisible();
    });
  });
});

// function sleep(milliseconds) {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// }
