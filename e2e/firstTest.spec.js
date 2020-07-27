describe("Mapeo", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have add button on home screen", async () => {
    await waitFor(element(by.id("mapboxMapView")))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id("addButtonMap"))).toBeVisible();
  });

  it("should show 'choose what is happening' screen after tapping add", async () => {
    await waitFor(element(by.id("mapboxMapView")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("addButtonMap")).tap();
    await expect(element(by.text("Choose what is happening"))).toBeVisible();
  });
});

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
