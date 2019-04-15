import React from "react";

import ObservationEdit from "../components/ObservationEdit";
import PresetsContext from "../context/PresetsContext";
import DraftObservationContext from "../context/DraftObservationContext";

class ObservationEditScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <DraftObservationContext.Consumer>
        {({ value }) => (
          <PresetsContext.Consumer>
            {({ getPreset }) => {
              const preset = getPreset(value);
              return (
                <ObservationEdit
                  isNew={navigation.getParam("observationId") === undefined}
                  onPressCategory={() => navigation.navigate("CategoryChooser")}
                  onPressCamera={() => navigation.navigate("AddPhoto")}
                  preset={preset}
                />
              );
            }}
          </PresetsContext.Consumer>
        )}
      </DraftObservationContext.Consumer>
    );
  }
}

ObservationEditScreen.navigationOptions = {
  title: "Edit"
};

export default ObservationEditScreen;
