// @flow
import React, { useEffect } from "react";
import { Alert } from "react-native";
import debug from "debug";

import IconButton from "../../sharedComponents/IconButton";
import { SaveIcon } from "../../sharedComponents/icons";
import useDraftObservation from "../../hooks/useDraftObservation";
import type { ObservationValue } from "../../context/ObservationsContext";
import type { NavigationProp } from "../../types";

const MINIMUM_ACCURACY = 10;
const log = debug("SaveButton");

type Props = {
  navigation: NavigationProp
};

const SaveButton = ({ navigation }: Props) => {
  const [{ value, savingStatus }, { saveDraft }] = useDraftObservation();

  const confirmationOptions = [
    {
      text: "Guardar",
      onPress: saveDraft,
      style: "default"
    },
    {
      text: "Ingrese manualmente",
      onPress: () => navigation.navigate("ManualGpsScreen"),
      style: "cancel"
    },
    {
      text: "Seguir esperando",
      onPress: () => log("Cancelled save")
    }
  ];

  const handleSavePress = () => {
    log("Draft value > ", value);
    if (!value) return;
    const isNew = navigation.getParam("observationId") === undefined;
    if (!isNew) return saveDraft();

    const hasLocation = value.lat !== undefined && value.lon !== undefined;
    const locationSetManually = value.metadata && value.metadata.manualLocation;
    if (hasLocation && (locationSetManually || isGpsAccurate(value))) {
      // Observation has a location, which is either from an accurate GPS
      // reading, or is manually entered
      saveDraft();
    } else if (!hasLocation) {
      // Observation doesn't have a location
      Alert.alert(
        "Sin señal del GPS",
        "Esta observación no tiene ubicación. Puedes seguir esperando el GPS, o guardarlo sin ubicación",
        confirmationOptions
      );
    } else {
      // Inaccurate GPS reading
      Alert.alert(
        "Señal débil del GPS",
        "La precisión del GPS está baja. Puedes seguir esperando que la precisión mejora, o guardar como es",
        confirmationOptions
      );
    }
  };

  useEffect(() => {
    if (savingStatus !== "success") return;
    const observationId = navigation.getParam("observationId");
    if (observationId === "string") {
      navigation.pop();
    } else {
      navigation.navigate("Home");
    }
  }, [savingStatus, navigation]);

  return (
    <IconButton onPress={handleSavePress}>
      <SaveIcon inprogress={savingStatus === "loading"} />
    </IconButton>
  );
};

export default SaveButton;

function isGpsAccurate(value: ObservationValue): boolean {
  // TODO: metadata changed in new mapeo-schema
  const accuracy =
    value &&
    value.metadata &&
    value.metadata.location &&
    value.metadata.location.position &&
    value.metadata.location.position.coords.accuracy;

  // If we don't have accuracy, allow save anyway
  return typeof accuracy === "number" ? accuracy < MINIMUM_ACCURACY : true;
}
