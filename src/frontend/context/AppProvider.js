// @flow
import * as React from "react";

import LocationContext from "./LocationContext";
import { ObservationsProvider } from "./ObservationsContext";
import { PresetsProvider } from "./PresetsContext";
import { DraftObservationProvider } from "./DraftObservationContext";

// This is a convenience wrapper for providing all App contexts to the tree,
// apart from the Permissions Provider which is needed separately.
const AppProvider = ({ children }: { children: React.Node }) => (
  <LocationContext.Provider>
    <ObservationsProvider>
      <PresetsProvider>
        <DraftObservationProvider>{children}</DraftObservationProvider>
      </PresetsProvider>
    </ObservationsProvider>
  </LocationContext.Provider>
);

export default AppProvider;
