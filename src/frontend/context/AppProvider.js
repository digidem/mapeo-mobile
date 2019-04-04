// @flow
import * as React from "react";

import LocationContext from "./LocationContext";
import ObservationsContext from "./ObservationsContext";
import PresetsContext from "./PresetsContext";

const AppProvider = ({ children }: { children: React.Node }) => (
  <LocationContext.Provider>
    <ObservationsContext.Provider>
      <PresetsContext.Provider>{children}</PresetsContext.Provider>
    </ObservationsContext.Provider>
  </LocationContext.Provider>
);

export default AppProvider;
