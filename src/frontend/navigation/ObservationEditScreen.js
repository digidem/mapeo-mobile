import React from "react";
import { Text, Image } from "react-native";

import DraftObservationContext from "../context/DraftObservationContext";
import CenteredView from "../components/CenteredView";

const ObservationEditScreen = () => (
  <DraftObservationContext.Consumer>
    {({ photos }) => (
      <CenteredView>
        {photos[0].thumbnailUri ? (
          <Image
            source={{
              uri: photos[0].thumbnailUri
            }}
            style={{ width: 200, height: 200 }}
          />
        ) : (
          <Text>{JSON.stringify(photos, null, 2)}</Text>
        )}
      </CenteredView>
    )}
  </DraftObservationContext.Consumer>
);

export default ObservationEditScreen;
