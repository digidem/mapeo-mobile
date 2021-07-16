// @flow
/* eslint-env jest/globals */

import React from "react";
import { Text } from "react-native";
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
    <IntlProvider
      messages={messages}
      textComponent={
        // This is not ideal. By default IntlProvider uses <Fragment> and this
        // is what we use in the real app, but react-native-testing-library is
        // unable to read Text in a fragment. It may be fixed by
        // https://github.com/callstack/react-native-testing-library/pull/554. I
        // think the only consequence is the visual styling of text might be
        // slightly differnent in the tests.
        Text
      }
      locale="en"
      defaultLocale="en"
    >
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
