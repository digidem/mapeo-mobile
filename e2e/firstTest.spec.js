describe("Mapeo", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have add button on home screen", async () => {
    await expect(element(by.id("addButtonMap"))).toBeVisible();
  });

  it("should show 'choose what is happening' screen after tapping add", async () => {
    await element(by.id("addButtonMap")).tap();
    await expect(element(by.text("Choose what is happening"))).toBeVisible();
  });

  // it("should show world screen after tap", async () => {
  //   await element(by.id("world_button")).tap();
  //   await expect(element(by.text("World!!!"))).toBeVisible();
  // });
});
