/* eslint-env detox/detox, jest/globals */

const { byId, byText } = require("./matcher");

// Make it easier to change where the settings screen is later
const navigateToSettings = async () => {
  // Argh! Syncing actions in tests is hard! Tests are flakey without this.
  // Retry without this if changing to react-navigation v5
  sleep(1);
  await byId("observationListButton").tap();
  sleep(1);
  await byId("settingsButton").tap();
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
      // await waitForVisible(byText("Choose what is happening"), 10000);
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

  // NOTE: This should be last, because of the restart after language change
  describe("Settings", () => {
    test("Clicking observation list then settings icon shows settings screen", async () => {
      await navigateToSettings();
      await expect(byId("settingsList")).toBeVisible();
    });

    // NOTE: This should be the last test within "Settings"
    test("Changing language in settings changes app language", async () => {
      await navigateToSettings();
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
});

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
