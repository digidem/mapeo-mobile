import * as React from "react";

import { LocationProvider } from "./LocationContext";
import { ObservationsProvider } from "./ObservationsContext";
import { ConfigProvider } from "./ConfigContext";
import { SettingsProvider } from "./SettingsContext";
import { DraftObservationProvider } from "./DraftObservationContext";
import { SecurityProvider } from "./SecurityContext";
import { MapStyleProvider } from "./MapStyleContext";

// This is a convenience wrapper for providing all App contexts to the tree,
// apart from the Permissions Provider which is needed separately.
const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <LocationProvider>
    <SecurityProvider>
      <ObservationsProvider>
        <ConfigProvider>
          <SettingsProvider>
            <DraftObservationProvider>
              <MapStyleProvider>{children}</MapStyleProvider>
            </DraftObservationProvider>
          </SettingsProvider>
        </ConfigProvider>
      </ObservationsProvider>
    </SecurityProvider>
  </LocationProvider>
);

export default AppProvider;
