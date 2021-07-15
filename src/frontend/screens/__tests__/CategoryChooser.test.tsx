/* eslint-env jest/globals */

import React from "react";
import { render } from "@testing-library/react-native";
import CategoryChooser from "../CategoryChooser";

// CategoryChooser uses useDraftObservation which uses the api module
jest.mock("../../api");

test("examples of some things", async () => {
  const chooser = render(<CategoryChooser navigation={{}} />);
  expect(chooser).toBeTruthy();
});
