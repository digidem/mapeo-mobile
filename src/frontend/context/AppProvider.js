// @flow
import * as React from "react";

import { LocationProvider } from "./LocationContext";
import { ObservationsProvider } from "./ObservationsContext";
import { ConfigProvider } from "./ConfigContext";
import { SettingsProvider } from "./SettingsContext";
import { DraftObservationProvider } from "./DraftObservationContext";

// This is a convenience wrapper for providing all App contexts to the tree,
// apart from the Permissions Provider which is needed separately.
const AppProvider = ({ children }: { children: React.Node }) => (
  <LocationProvider>
    <ObservationsProvider>
      <ConfigProvider>
        <SettingsProvider>
          <DraftObservationProvider>{children}</DraftObservationProvider>
        </SettingsProvider>
      </ConfigProvider>
    </ObservationsProvider>
  </LocationProvider>
);

export default AppProvider;
