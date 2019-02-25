describe("Example", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show main screen", async () => {
    await expect(element(by.id("root"))).toBeVisible();
  });

  it("should show alert after messaging node", async () => {
    await element(by.id("message_node_button")).tap();
    await expect(element(by.text("From node: A message!"))).toBeVisible();
  });
});
