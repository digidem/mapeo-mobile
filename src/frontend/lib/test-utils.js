import { render } from "@testing-library/react-native";
import { IntlProvider } from "react-intl";
import { PermissionsProvider } from "../context/PermissionsContext";
import { ObservationsProvider } from "../context/ObservationsContext";
import { ConfigProvider } from "../context/ConfigContext";
import { DraftObservationProvider } from "../context/DraftObservationContext";
import AppLoading from "../AppLoading";
import AppContainer from "./AppContainer";
// import { persistNavigationState, loadNavigationState } from "../App";
import messages from "../../../translations/messages.json";

const App = () => (
  <IntlProvider messages={messages} locale="en" defaultLocale="en">
    <PermissionsProvider>
      <AppLoading>
        <ObservationsProvider>
          <ConfigProvider>
            <DraftObservationProvider>
              <AppContainer
              // persistNavigationState={persistNavigationState}
              // loadNavigationState={loadNavigationState}
              />
            </DraftObservationProvider>
          </ConfigProvider>
        </ObservationsProvider>
      </AppLoading>
    </PermissionsProvider>
  </IntlProvider>
);
const customRender = (ui, options) => render(ui, { wrapper: App, ...options });

// re-export everything
export * from "@testing-library/react-native";

// override render method
export { customRender as render };
