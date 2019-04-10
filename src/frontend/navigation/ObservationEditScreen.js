import React from "react";
import { Text, Image } from "react-native";

import DraftObservationContext from "../context/DraftObservationContext";
import CenteredView from "../components/CenteredView";
import Thumbnail from "../components/Thumbnail";

const ObservationEditScreen = () => (
  <DraftObservationContext.Consumer>
    {({ photos }) => (
      <CenteredView>
        <Thumbnail
          uri={photos[0].thumbnailUri}
          loading={photos[0].capturing}
          error={photos[0].error}
        />
      </CenteredView>
    )}
  </DraftObservationContext.Consumer>
);

export default ObservationEditScreen;
