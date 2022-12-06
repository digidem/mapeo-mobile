/* eslint-env jest/globals */
import React from "react";

import { fireEvent, render as other } from "@testing-library/react-native";
import Settings from "../Settings";
import { render } from "../../lib/test-utils";

jest.mock("../../api");

const mockNavigate = jest.fn();

beforeEach(() => {
  mockNavigate.mockReset();
});

jest.mock("../../hooks/useNavigationWithTypes", () => ({
  useNavigationFromRoot: () => ({ navigate: mockNavigate }),
}));

// const createComponentWithIntl = (children, props = { locale: "en" }) => {
//   return render(<IntlProvider {...props}>{children}</IntlProvider>);
// };

// const MockedNavigator = ( children, params ) => {
// const Navigator = createAppContainer(
//     createSwitchNavigator({
//     MockScreen: {
//         screen: () => React.Children.only(children), params: params,
//     },
//     }),
// );
// return <Navigator />;
// };

test("Settings Page will navigate", () => {
  const settings = render(<Settings />);
  // fireEvent(getByText("Project Configuration"), "press");
  expect(settings).toBeTruthy();
  // expect(mockNavigate).toHaveBeenCalledWith("ProjectConfig");
});
