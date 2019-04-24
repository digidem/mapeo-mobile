// @flow
import * as React from "react";

import LocationContext from "./LocationContext";
import ObservationsContext from "./ObservationsContext";
import PresetsContext from "./PresetsContext";
import DraftObservationContext from "./DraftObservationContext";

// This is a convenience wrapper for providing all App contexts to the tree,
// apart from the Permissions Provider which is needed separately.
const AppProvider = ({ children }: { children: React.Node }) => (
  <LocationContext.Provider>
    <ObservationsContext.Provider>
      <PresetsContext.Provider>
        <DraftObservationContext.Provider>
          {children}
        </DraftObservationContext.Provider>
      </PresetsContext.Provider>
    </ObservationsContext.Provider>
  </LocationContext.Provider>
);

export default AppProvider;
