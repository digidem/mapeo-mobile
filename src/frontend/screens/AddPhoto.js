// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../sharedComponents/Text";
import { TouchableNativeFeedback } from "../sharedComponents/Touchables";
import debug from "debug";
import { defineMessages, FormattedMessage } from "react-intl";

import CameraView from "../sharedComponents/CameraView";
import useDraftObservation, {
  type CapturedPictureMM,
} from "../hooks/useDraftObservation";

import type { NavigationScreenConfigProps } from "react-navigation";

const m = defineMessages({
  cancel: {
    id: "screens.AddPhoto.cancel",
    defaultMessage: "Cancel",
  },
});

const log = debug("AddPhotoScreen");

const AddPhotoScreen = ({ navigation }: NavigationScreenConfigProps) => {
  const [, { addPhoto }] = useDraftObservation();

  // TODO: addPhoto changes every render, so we can't useCallback here
  const handleAddPress = (e: any, capture: Promise<CapturedPictureMM>) => {
    log("pressed add button");
    addPhoto(capture);
    // $FlowFixMe
    navigation.pop();
  };

  const handleCancelPress = (e: any) => {
    log("cancelled");
    // $FlowFixMe
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <CameraView onAddPress={handleAddPress} />
      <TouchableNativeFeedback
        style={styles.cancelButton}
        onPress={handleCancelPress}
      >
        <Text style={styles.cancelButtonLabel}>
          <FormattedMessage {...m.cancel} />
        </Text>
      </TouchableNativeFeedback>
    </View>
  );
};

AddPhotoScreen.navigationOptions = {
  headerShown: false,
};

export default AddPhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  cancelButton: {
    flex: 0,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "red",
  },
  cancelButtonLabel: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
