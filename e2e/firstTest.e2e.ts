/* eslint-env detox/detox, jest/globals */

import { byId, byText } from "./matcher";
import { expect } from "detox";
import delay from "delay";

// Make it easier to change where the settings screen is later
const navigateToSettings = async () => {
  await byId("observationListButton").tap();
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

    test("Clicking back button after add shows confirmation alert and discards observation", async () => {
      await byId("addButtonMap").tap();
      await device.pressBack();
      await expect(byText("Discard observation?")).toBeVisible();
      await byText("DISCARD WITHOUT SAVING").tap();
      await byId("observationListButton").tap();
      await expect(byId("observationsEmptyView")).toExist();
    });

    test("Can create observation", async () => {
      await byId("addButtonMap").tap();
      await byId("animalCategoryButton").tap();
      await byId("saveButton").tap();
      await byText("SAVE").tap();
      await byId("observationListButton").tap();
      await expect(byId("observationListItem:0")).toExist();
    });

    // NOTE: This test relies on the observation created by the previous test
    test("Clicking back button after edit shows confirmation alert and discards edits", async () => {
      await byId("observationListButton").tap();
      await byId("observationListItem:0").tap();
      // There is a delay before the edit button appears as the backend checks
      // if the observation is created by the user so that editing is enabled
      await waitFor(byId("editButton")).toBeVisible().withTimeout(2000);
      await byId("editButton").tap();
      await byId("observationDescriptionField").typeText("Test description");
      // This test fails intermittently without a delay here
      await delay(200);
      // Closes keyboard
      await device.pressBack();
      // Cancels edit
      await device.pressBack();
      // Checks this says "Discard changes" not "Discard observation", which
      // happens when cancelling a new observation
      await expect(byText("Discard changes?")).toBeVisible();
      await expect(byText("DISCARD CHANGES")).toBeVisible();
      await byText("DISCARD CHANGES").tap();
      // Delete and re-install to remove added observation
      await device.launchApp({ delete: true });
    });
  });

  describe("GPS", () => {
    test("Clicking GPS pill shows GPS screen", async () => {
      await byId("gpsPillButton").tap();
      await expect(byText("Current GPS Location")).toBeVisible();
      await expect(byId("gpsScreenScrollView")).toBeVisible();
    });
  });

  describe("Settings", () => {
    test("Clicking observation list then settings icon shows settings screen", async () => {
      await navigateToSettings();
      await expect(byId("settingsList")).toBeVisible();
    });

    test("About Mapeo in Settings shows version number", async () => {
      await navigateToSettings();
      await byId("settingsAboutButton").tap();
      await expect(byText("Mapeo version")).toBeVisible();
    });

    // NOTE: This test needs to be last
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
      // This was failing in Github actions for some reason, so this test needs
      // to be last (since everything will be in Spanish from now on)
      // await device.launchApp({ delete: true });
    });
  });
});
