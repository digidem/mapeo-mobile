// @flow
import React from "react";
import debug from "debug";

import IconButton from "../../sharedComponents/IconButton";
import { DeleteIcon } from "../../sharedComponents/icons";
import { deleteObservation } from "../../api";
import type { NavigationScreenProp } from "react-navigation";

type Props = {
  navigation: NavigationScreenProp<{}>,
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
    log(
      "Starting delete of " + (observationId) + " observation"
    );
    this.setState({ deleting: true });

    try {
      await deleteObservation(observationId);
      // $FlowFixMe
      navigation.pop();
      navigation.navigate("Home");
    } catch (e) {
      log("Error:\n", e);
      this.setState({ error: true });
    } finally {
      this.setState({ saving: false });
    }
  }

  render() {
    return (
      <IconButton onPress={this.handleSavePress}>
        <DeleteIcon inprogress={this.state.saving} />
      </IconButton>
    );
  }
}


export default DeleteButton;
