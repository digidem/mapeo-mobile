// @flow
import React from "react";

import IconButton from "../../sharedComponents/IconButton";
import { withDraft } from "../../context/DraftObservationContext";
import { withObservations } from "../../context/ObservationsContext";

import type { NavigationScreenProp } from "react-navigation";
import type { ObservationsMap } from "../../context/ObservationsContext";
import type { DraftObservationContext } from "../../context/DraftObservationContext";
import { EditIcon } from "../../sharedComponents/icons";

type Props = {
  navigation: NavigationScreenProp<{}>,
  observations: ObservationsMap,
  newDraft: $ElementType<DraftObservationContext, "newDraft">
};

// Make this a Pure Component because it's wrapped with Draft which will
// re-render in the background while the user edits text
class EditButton extends React.PureComponent<Props> {
  handlePress = () => {
    const { navigation, observations, newDraft } = this.props;
    const observationId = navigation.getParam("observationId");
    throw new Error("Test Error");
    if (typeof observationId !== "string") return;
    const obs = observations.get(observationId);
    if (!obs) return;
    newDraft(obs.value);
    navigation.navigate("ObservationEdit", { observationId });
  };
  render() {
    const { navigation, observations } = this.props;
    const id = navigation.getParam("observationId");
    // Don't render the button if observation doesn't exist
    if (id == null || !observations.has(id)) return null;
    return (
      <IconButton onPress={this.handlePress}>
        <EditIcon />
      </IconButton>
    );
  }
}

export default withObservations(["observations"])(
  withDraft(["newDraft"])(EditButton)
);
