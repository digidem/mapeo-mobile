// @flow
import * as React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../sharedComponents/Text";
import debug from "debug";
import { useNavigation, useIsFocused } from "react-navigation-hooks";
import { defineMessages, FormattedMessage } from "react-intl";

import CameraView from "../sharedComponents/CameraView";
import useDraftObservation, {
  type CapturedPictureMM,
} from "../hooks/useDraftObservation";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS,
} from "../context/PermissionsContext";

const m = defineMessages({
  noCameraAccess: {
    id: "screens.CameraScreen.noCameraAccess",
    defaultMessage: "No access to camera",
    description:
      "Error message shown when app does not have permissions to camera",
  },
});

const log = debug("mapeo:CameraScreen");

const CameraScreen = () => {
  const isFocussed = useIsFocused();
  const [, { newDraft }] = useDraftObservation();
  const navigation = useNavigation();
  const { permissions } = React.useContext(PermissionsContext);

  const handleAddPress = React.useCallback(
    (e: any, capture: Promise<CapturedPictureMM>) => {
      log("pressed add button");
      newDraft(undefined, { tags: {} }, capture);
      navigation.navigate("CategoryChooser");
    },
    [newDraft, navigation]
  );

  return (
    <View style={styles.container}>
      {permissions[PERMISSIONS.CAMERA] !== RESULTS.GRANTED ? (
        <Text>
          <FormattedMessage {...m.noCameraAccess} />
        </Text>
      ) : isFocussed ? (
        <CameraView onAddPress={handleAddPress} />
      ) : null}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
