// @flow
import React from "react";

import IconButton from "../../sharedComponents/IconButton";
import useObservation from "../../hooks/useObservation";
import useDraftObservation from "../../hooks/useDraftObservation";

import { EditIcon } from "../../sharedComponents/icons";
import type { NavigationProp } from "../../types";

type Props = {
  navigation: NavigationProp
};

const EditButton = ({ navigation }: Props) => {
  const observationId = navigation.getParam("observationId");
  const [{ observation }] = useObservation(observationId);
  const [, { newDraft }] = useDraftObservation();

  function handlePress() {
    if (!observation) return;
    newDraft(observation.id, observation.value);
    navigation.navigate("ObservationEdit", { observationId });
  }

  // Don't render the button if observation doesn't exist
  if (!observation) return null;
  return (
    <IconButton onPress={handlePress}>
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;
