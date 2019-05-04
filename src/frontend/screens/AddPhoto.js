// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "../sharedComponents/Touchables";
import debug from "debug";

import CameraView from "../sharedComponents/CameraView";
import { withDraft } from "../context/DraftObservationContext";

import type {
  DraftObservationContext,
  CapturePromise
} from "../context/DraftObservationContext";
import type { NavigationScreenConfigProps } from "react-navigation";

const log = debug("AddPhotoScreen");

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  addPhoto: $ElementType<DraftObservationContext, "addPhoto">
};

class AddPhotoScreen extends React.PureComponent<Props> {
  static navigationOptions = {
    header: null
  };

  handleAddPress = (e: any, capture: CapturePromise) => {
    log("pressed add button");
    const { addPhoto, navigation } = this.props;
    addPhoto(capture);
    // $FlowFixMe
    navigation.pop();
  };

  handleCancelPress = (e: any) => {
    log("cancelled");
    // $FlowFixMe
    this.props.navigation.pop();
  };

  render() {
    return (
      <View style={styles.container}>
        <CameraView onAddPress={this.handleAddPress} />
        <TouchableNativeFeedback
          style={styles.cancelButton}
          onPress={this.handleCancelPress}
        >
          <Text style={styles.cancelButtonLabel}>Cancelar</Text>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

export default withDraft(["addPhoto"])(AddPhotoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  cancelButton: {
    flex: 0,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "red"
  },
  cancelButtonLabel: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  }
});
