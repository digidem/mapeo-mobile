// @flow
import * as React from "react";

import LocationContext from "./LocationContext";
import ObservationsContext from "./ObservationsContext";
import PresetsContext from "./PresetsContext";
import DraftObservationContext from "./DraftObservationContext";

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
