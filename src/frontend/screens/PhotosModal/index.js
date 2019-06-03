// @flow
import React from "react";

import ObservationPreset from "../../context/ObservationPreset";
import DraftObservationContext, {
  filterPhotosFromAttachments
} from "../../context/DraftObservationContext";
import PhotosView from "./PhotosView";

type Props = {
  navigation: any
};

const PhotosModal = ({ navigation }: Props) => {
  const observationId = navigation.getParam("observationId");
  const photoIndex = navigation.getParam("photoIndex");
  const isEditing = navigation.getParam("editing");

  // If we reach this modal from the editing context, then we want to show the
  // photos which are attached to the draft observation, which may include
  // photos which have been added and are not yet saved, so we use the draft
  // context, otherwise we use the observation context
  if (isEditing) {
    return (
      <DraftObservationContext.Consumer>
        {({ value, photos }) => {
          if (!value) return navigation.pop();
          if (!photos) return navigation.pop();
          return (
            <PhotosView
              onClose={() => navigation.pop()}
              photos={photos}
              initialIndex={photoIndex}
            />
          );
        }}
      </DraftObservationContext.Consumer>
    );
  } else {
    return (
      <ObservationPreset id={observationId}>
        {({ observation }) => {
          if (!observation) return navigation.pop();
          if (!observation.value.attachments) return navigation.pop();
          const photos = filterPhotosFromAttachments(
            observation.value.attachments
          );
          return (
            <PhotosView
              onClose={() => navigation.pop()}
              photos={photos}
              initialIndex={photoIndex}
            />
          );
        }}
      </ObservationPreset>
    );
  }
};

export default PhotosModal;
