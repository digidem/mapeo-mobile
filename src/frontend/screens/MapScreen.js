// @flow
import * as React from "react";
import { View, Text } from "react-native";
import { defineMessages, useIntl } from "react-intl";

import debug from "debug";

import MapView from "../sharedComponents/MapView";
import Loading from "../sharedComponents/Loading";
import useDraftObservation from "../hooks/useDraftObservation";
import useMapStyle from "../hooks/useMapStyle";
import ObservationsContext from "../context/ObservationsContext";
import LocationContext from "../context/LocationContext";
import AddButton from "../sharedComponents/AddButton";
import type { NavigationProp } from "../types";

const log = debug("mapeo:MapScreen");

const msgs = defineMessages({
  createObservation: {
    id: "screens.MapScreen.createObservationAccessibilityLabel",
    defaultMessage: "Create Observation",
    description:
      'Accessibility label for screen readers for "Create Observation" button on map screen',
  },
});

type Props = {
  navigation: NavigationProp,
};

const MapScreen = ({ navigation }: Props) => {
  const [, { newDraft }] = useDraftObservation();
  const { styleURL, styleType } = useMapStyle();
  const { formatMessage } = useIntl();

  const [{ observations, status }] = React.useContext(ObservationsContext);
  const location = React.useContext(LocationContext);

  const handleObservationPress = React.useCallback(
    (observationId: string) =>
      navigation.navigate("Observation", { observationId }),
    [navigation]
  );

  const handleAddPress = React.useCallback(
    (e: any) => {
      log("pressed add button");
      newDraft(undefined, { tags: {} });
      navigation.navigate("CategoryChooser");
    },
    [navigation, newDraft]
  );

  return (
    <View style={{ flex: 1 }}>
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <Text>Error</Text>
      ) : (
        <MapView
          location={location}
          observations={observations}
          onPressObservation={handleObservationPress}
          styleURL={styleURL}
          styleType={styleType}
        />
      )}
      <AddButton
        testID="addButtonMap"
        accessible={true}
        accessibilityLabel={formatMessage(msgs.createObservation)}
        onPress={handleAddPress}
      />
    </View>
  );
};

export default MapScreen;
