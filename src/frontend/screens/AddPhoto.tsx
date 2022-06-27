import React from "react";
import { View, StyleSheet, GestureResponderEvent } from "react-native";
import Text from "../sharedComponents/Text";
import { TouchableNativeFeedback } from "../sharedComponents/Touchables";
import debug from "debug";
import { defineMessages, FormattedMessage } from "react-intl";

import CameraView from "../sharedComponents/CameraView";
import {
  useDraftObservation,
  CapturedPictureMM,
} from "../hooks/useDraftObservation";
import { NativeNavigationProp } from "../sharedTypes";
import { useSetHeader } from "../hooks/useSetHeader";

const m = defineMessages({
  cancel: {
    id: "screens.AddPhoto.cancel",
    defaultMessage: "Cancel",
  },
});

const log = debug("AddPhotoScreen");

const AddPhotoScreen = ({ navigation }: NativeNavigationProp<"AddPhoto">) => {
  useSetHeader({ headerShown: false });
  const [, { addPhoto }] = useDraftObservation();

  // TODO: addPhoto changes every render, so we can't useCallback here
  const handleAddPress = (e: any, capture: Promise<CapturedPictureMM>) => {
    log("pressed add button");
    addPhoto(capture);
    navigation.pop();
  };

  const handleCancelPress = (e: GestureResponderEvent) => {
    log("cancelled");
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
