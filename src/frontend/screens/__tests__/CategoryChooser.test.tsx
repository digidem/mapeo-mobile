/* eslint-env jest/globals */

import React from "react";
import { render } from "../../lib/test-utils";
import CategoryChooser from "../CategoryChooser";

// CategoryChooser uses useDraftObservation which uses the api module
jest.mock("../../api");
jest.mock("../../hooks/useNavigationWithTypes");
jest.mock("../../hooks/useSetHeader");

test("examples of some things", async () => {
  const chooser = render(<CategoryChooser navigation={{}} />);
  expect(chooser).toBeTruthy();
});
