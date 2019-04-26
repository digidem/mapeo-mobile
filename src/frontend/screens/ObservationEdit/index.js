// @flow
import React from "react";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationEditView from "./ObservationEditView";
import SaveButton from "./SaveButton";
import DraftObservationContext from "../../context/DraftObservationContext";
import PresetsContext from "../../context/PresetsContext";

const ObservationEdit = ({ navigation }: NavigationScreenConfigProps) => (
  <DraftObservationContext.Consumer>
    {({ value }) => (
      <PresetsContext.Consumer>
        {({ getPreset }) => (
          <ObservationEditView
            isNew={navigation.getParam("observationId") === undefined}
            onPressCategory={() => navigation.navigate("CategoryChooser")}
            onPressCamera={() => navigation.navigate("AddPhoto")}
            preset={getPreset(value)}
          />
        )}
      </PresetsContext.Consumer>
    )}
  </DraftObservationContext.Consumer>
);

ObservationEdit.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("observationId") ? "Edit" : "Create Observation",
  headerRight: <SaveButton navigation={navigation} />
});

export default ObservationEdit;
