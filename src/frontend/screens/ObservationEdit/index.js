// @flow
import React from "react";
import type { NavigationScreenConfigProps } from "react-navigation";

import ObservationEditView from "./ObservationEditView";
import SaveButton from "./SaveButton";
import DraftObservationContext from "../../context/DraftObservationContext";
import PresetsContext from "../../context/PresetsContext";

class ObservationEdit extends React.Component<NavigationScreenConfigProps> {
  static navigationOptions = ({ navigation }: any) => ({
    title: navigation.getParam("observationId")
      ? "Editar"
      : "Nueva Observación",
    headerRight: <SaveButton navigation={navigation} />
  });

  handleCategoryPress = () => {
    this.props.navigation.navigate("CategoryChooser");
  };

  handleCameraPress = () => {
    this.props.navigation.navigate("AddPhoto");
  };

  handleDetailsPress = () => {
    this.props.navigation.navigate("ObservationDetails", { question: 1 });
  };

  handlePhotoPress = (photoIndex: number) => {
    const { navigation } = this.props;
    navigation.navigate("PhotosModal", {
      photoIndex: photoIndex,
      observationId: navigation.getParam("observationId"),
      editing: true
    });
  };

  render() {
    const { navigation } = this.props;
    // It's important that the props are shallow-equal between renders.
    // ObservationEditView is a memoized/pure component, so it will not
    // re-render when props are shallow-equal. We auto-save edits to observation
    // fields to DraftObservationContext on every keypress, so the children of
    // the context will re-render frequently. The properties passed to
    // ObservationEditView here must not be inline functions (`() =>
    // doSomething)`) or inline objects (`myProp={{ foo: "bar" }}`) because
    // these change on every render.
    return (
      <DraftObservationContext.Consumer>
        {({ value }) => (
          <PresetsContext.Consumer>
            {({ getPreset }) => (
              <ObservationEditView
                isNew={navigation.getParam("observationId") === undefined}
                onPressCategory={this.handleCategoryPress}
                onPressCamera={this.handleCameraPress}
                onPressDetails={this.handleDetailsPress}
                onPressPhoto={this.handlePhotoPress}
                preset={getPreset(value)}
              />
            )}
          </PresetsContext.Consumer>
        )}
      </DraftObservationContext.Consumer>
    );
  }
}

export default ObservationEdit;
