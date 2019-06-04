// @flow
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import debug from "debug";
import {
  NavigationActions,
  type NavigationScreenConfigProps
} from "react-navigation";

import CameraView from "../sharedComponents/CameraView";
import HomeHeader from "../sharedComponents/HomeHeader";
import withNavigationFocus from "../lib/withNavigationFocus";
import PermissionsContext, {
  PERMISSIONS,
  RESULTS
} from "../context/PermissionsContext";
import {
  withDraft,
  type DraftObservationContext,
  type CapturePromise
} from "../context/DraftObservationContext";

const log = debug("mapeo:CameraScreen");

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  newDraft: $ElementType<DraftObservationContext, "newDraft">,
  isFocused: boolean
};

class CameraScreen extends React.Component<Props> {
  handleAddPress = (e: any, capture: CapturePromise) => {
    log("pressed add button");
    const { newDraft, navigation } = this.props;
    newDraft({ tags: {} }, capture);
    navigation.navigate(
      "NewObservation",
      {},
      NavigationActions.navigate({ routeName: "CategoryChooser" })
    );
  };

  render() {
    const { navigation, isFocused } = this.props;
    return (
      <View style={styles.container}>
        <PermissionsContext.Consumer>
          {({ permissions }) => {
            if (permissions[PERMISSIONS.CAMERA] !== RESULTS.GRANTED)
              return <Text>No access to camera</Text>;
            if (!isFocused) return null;
            return <CameraView onAddPress={this.handleAddPress} />;
          }}
        </PermissionsContext.Consumer>
        <HomeHeader navigation={navigation} />
      </View>
    );
  }
}

export default withDraft(["newDraft"])(withNavigationFocus(CameraScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
