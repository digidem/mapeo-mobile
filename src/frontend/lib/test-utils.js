// @flow
/* eslint-env jest/globals */

import React from "react";
import { render } from "@testing-library/react-native";
import { IntlProvider } from "react-intl";
import { PermissionsProvider } from "../context/PermissionsContext";
import { DraftObservationProvider } from "../context/DraftObservationContext";
import { type ObservationsContextType } from "../context/ObservationsContext";
import { type ConfigContextType } from "../context/ConfigContext";
import messages from "../../../translations/messages.json";

jest.mock("../hooks/usePersistedState");

const ObservationsContext = React.createContext<ObservationsContextType | void>();
const ConfigContext = React.createContext<ConfigContextType | void>();

const observationsDefaultContext: ObservationsContextType = [
  {
    observations: new Map(),
    status: "success",
  },
  () => {},
];

const configDefaultContext: ConfigContextType = [
  {
    presets: new Map(),
    fields: new Map(),
    metadata: {},
    messages: {},
    status: "success",
  },
  {
    reload: () => {},
    replace: () => {},
  },
];

const customRender = (
  ui: React$Node,
  {
    observationsContext = observationsDefaultContext,
    configContext = configDefaultContext,
    ...renderOptions
  }: {
    observationsContext?: ObservationsContextType,
    configContext?: ConfigContextType,
  } = {}
) =>
  render(
    <IntlProvider messages={messages} locale="en" defaultLocale="en">
      <PermissionsProvider>
        <ObservationsContext.Provider value={observationsContext}>
          <ConfigContext.Provider value={configContext}>
            <DraftObservationProvider>{ui}</DraftObservationProvider>
          </ConfigContext.Provider>
        </ObservationsContext.Provider>
      </PermissionsProvider>
    </IntlProvider>,
    renderOptions
  );

// re-export everything
export * from "@testing-library/react-native";

// override render method
export { customRender as render };
