import React from "react";

import { fireEvent, render as other } from "@testing-library/react-native";
import Settings, { ProjectConfig } from "../Settings";
import { render } from "../../lib/test-utils";
import { IntlProvider } from "react-intl";

jest.mock("../../api");

jest.mock("react-navigation-hooks", () => ({
  useNavigation: () => jest.fn(),
  useNavigationParam: jest.fn(
    jest.requireActual("react-navigation-hooks").useNavigationParam
  ),
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
  const settingWithIntl = render(<Settings />);
  const label = settingWithIntl.getByTestId("settingsProjectConfigButton");
  expect(label).toBeTruthy();
});
