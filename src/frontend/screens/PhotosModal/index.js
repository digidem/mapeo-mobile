// @flow
import React from "react";

import { filterPhotosFromAttachments } from "../../lib/utils";
import useObservation from "../../hooks/useObservation";
import useDraftObservation from "../../hooks/useDraftObservation";
import PhotosView from "./PhotosView";

type Props = {
  onClose: () => void,
  photoIndex: number
};

const DraftPhotosModal = ({ onClose, photoIndex }: Props) => {
  const [{ value, photos }] = useDraftObservation();
  if (!value || !photos) {
    onClose();
    return null;
  }
  return (
    <PhotosView onClose={onClose} photos={photos} initialIndex={photoIndex} />
  );
};

const ExistingPhotosModal = ({
  onClose,
  photoIndex,
  observationId
}: Props & { observationId: string }) => {
  const [{ observation }] = useObservation(observationId);
  if (!observation || !observation.value.attachments) {
    onClose();
    return null;
  }
  const photos = filterPhotosFromAttachments(observation.value.attachments);
  return (
    <PhotosView onClose={onClose} photos={photos} initialIndex={photoIndex} />
  );
};

const PhotosModal = ({ navigation }: { navigation: any }) => {
  const observationId = navigation.getParam("observationId");
  const photoIndex = navigation.getParam("photoIndex");
  const isEditing = navigation.getParam("editing");

  // If we reach this modal from the editing context, then we want to show the
  // photos which are attached to the draft observation, which may include
  // photos which have been added and are not yet saved, so we use the draft
  // context, otherwise we use the observation context
  if (isEditing) {
    return (
      <DraftPhotosModal photoIndex={photoIndex} onClose={navigation.pop} />
    );
  } else {
    return (
      <ExistingPhotosModal
        photoIndex={photoIndex}
        observationId={observationId}
        onClose={navigation.pop}
      />
    );
  }
};

export default PhotosModal;
