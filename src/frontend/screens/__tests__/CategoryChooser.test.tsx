/* eslint-env jest/globals */

import React from "react";
import { render } from "../../lib/test-utils";
import CategoryChooser from "../CategoryChooser";

// CategoryChooser uses useDraftObservation which uses the api module
jest.mock("../../api");
jest.mock("../../hooks/useNavigationWithTypes");

test("examples of some things", async () => {
  const chooser = render(<CategoryChooser />);
  expect(chooser).toBeTruthy();
});
