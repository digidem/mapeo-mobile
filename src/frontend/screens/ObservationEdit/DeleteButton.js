// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import debug from "debug";
import { withNavigation } from "react-navigation";
import { TouchableOpacity } from "../../sharedComponents/Touchables";

import { DeleteIcon } from "../../sharedComponents/icons";
import { RED, WHITE } from "../../lib/styles";
import { deleteObservation } from "../../api";
import type { NavigationScreenProp } from "react-navigation";

type Props = {
  navigation: NavigationScreenProp<{}>
};

type State = {
  deleting: boolean,
  error: boolean
};

const log = debug("DeleteButton");

class DeleteButton extends React.PureComponent<Props, State> {
  state = {
    deleting: false,
    error: false
  };

  handleDeletePress = async () => {
    const { navigation } = this.props;
    const observationId = navigation.getParam("observationId");
    if (!observationId)
      return log("Observation not found when trying to delete");
    log("Starting delete of " + observationId + " observation");
    this.setState({ deleting: true });

    try {
      await deleteObservation(observationId);
      // $FlowFixMe
      navigation.pop();
    } catch (e) {
      log("Error:", e);
      this.setState({ error: true });
    } finally {
      this.setState({ deleting: false });
    }
  };

  render() {
    const { deleting } = this.state;
    return (
      <TouchableOpacity onPress={this.handleDeletePress}>
        <View style={[styles.button, { opacity: deleting ? 0.5 : 1 }]}>
          <DeleteIcon color={WHITE} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>BORRAR</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

// $FlowFixMe
export default withNavigation(DeleteButton);

const styles = StyleSheet.create({
  button: {
    backgroundColor: RED,
    borderRadius: 30,
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    marginHorizontal: 20
  },
  buttonIcon: {
    paddingRight: 20
  },
  buttonText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: "700"
  }
});
