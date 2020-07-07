/* eslint-env detox/detox, jest/globals */

const waitForVisible = async (element, timeout = 5000) => {
  waitFor(element)
    .toBeVisible()
    .withTimeout(timeout);
};
const waitForMap = async () => {
  await waitForVisible(element(by.id("mapboxMapView")));
};
const waitForCamera = async () => {
  await waitForVisible(element(by.id("camera")));
};
const tapMapAddButton = async () => {
  await element(by.id("addButtonMap")).tap();
};
const tapCameraAddButton = async () => {
  await waitForVisible(element(by.id("addButtonCamera")));
  await element(by.id("addButtonCamera")).tap();
};
const tapGpsPill = async () => await element(by.id("gpsPillButton")).tap();
const switchToCameraTab = async () => {
  await element(by.id("tabBarButtonCamera")).tap();
};
const switchToMapTab = async () => {
  await element(by.id("tabBarButtonMap")).tap();
};
const navigateToObservationList = async () => {
  await element(by.id("observationListButton")).tap();
};
const navigateToSettings = async () => {
  await navigateToObservationList();
  await waitForVisible(element(by.id("settingsButton")));
  await element(by.id("settingsButton")).tap();
};

describe("Mapeo", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe("Initial load & home screen", () => {
    test("Shows map when app loads", async () => {
      await waitForMap();
      await expect(element(by.id("mapboxMapView"))).toBeVisible();
    });

    test("Touching tab bar icons switches between map & camera", async () => {
      await switchToCameraTab();
      await waitForCamera();
      await expect(element(by.id("camera"))).toBeVisible();
      await switchToMapTab();
      await waitForMap();
      await expect(element(by.id("mapboxMapView"))).toBeVisible();
    });
  });

  describe("Settings", () => {
    test("Clicking observation list then settings icon shows settings screen", async () => {
      await navigateToSettings();
      await expect(element(by.id("settingsList"))).toBeVisible();
    });

    test("Changing language in settings changes app language", async () => {
      await navigateToSettings();
      await element(by.id("settingsLanguageButton")).tap();
      await waitFor(element(by.id("esLanguageButton")))
        .toBeVisible()
        .whileElement(by.id("languageScrollView"))
        .scroll(100, "down");
      await element(by.id("esLanguageButton")).tap();
      await navigateToObservationList();
      await expect(element(by.text("Observaciones"))).toBeVisible();
      // Delete and re-install the app after changing language, so that it
      // resets to the default language
      await device.launchApp({ delete: true });
    });
  });

  describe("Create observation", () => {
    test("Tapping add from map screen shows 'choose what is happening' screen", async () => {
      await tapMapAddButton();
      await expect(element(by.text("Choose what is happening"))).toBeVisible();
    });

    test("Tapping add from camera screen shows 'choose what is happening' screen", async () => {
      await switchToCameraTab();
      await tapCameraAddButton();
      // Need to wait for this screen because the camera shutter button is async
      // and does not switch screens until the photo is taken
      await waitForVisible(element(by.text("Choose what is happening")), 10000);
      await expect(element(by.text("Choose what is happening"))).toBeVisible();
    });
  });

  describe("GPS", () => {
    test("Clicking GPS pill shows GPS screen", async () => {
      await tapGpsPill();
      await expect(element(by.text("Current GPS Location"))).toBeVisible();
      await expect(element(by.id("gpsScreenScrollView"))).toBeVisible();
    });
  });
});

// function sleep(milliseconds) {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// }
