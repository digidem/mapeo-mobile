// @flow
import { render } from "@testing-library/react-native";
import React from "react";
import CameraScreen from "../CameraScreen";

test("This is a test of the test", () => {
  const screen = render(<CameraScreen />);
  expect(screen).toBeTruthy();
});
