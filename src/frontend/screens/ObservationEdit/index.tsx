import React, { useCallback } from "react";
import { defineMessages } from "react-intl";

import ObservationEditView from "./ObservationEditView";
import SaveButton from "./SaveButton";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import { NativeRootNavigationProps } from "../../sharedTypes";
import { useSetHeader } from "../../hooks/useSetHeader";

const m = defineMessages({
  editTitle: {
    id: "screens.ObservationEdit.editTitle",
    defaultMessage: "Edit Observation",
    description: "screen title for edit observation screen",
  },
  newTitle: {
    id: "screens.ObservationEdit.newTitle",
    defaultMessage: "New Observation",
    description: "screen title for new observation screen",
  },
});

const ObservationEdit = ({
  navigation,
  route,
}: NativeRootNavigationProps<"ObservationEdit">) => {
  const observationId = route.params?.observationId;
  useSetHeader({
    headerTitle: !!observationId ? m.editTitle : m.newTitle,
    headerRight: () => <SaveButton observationId={observationId} />,
  });
  const handleCategoryPress = useCallback(() => {
    navigation.navigate({
      key: "fromObservationEdit",
      name: "CategoryChooser",
    });
  }, [navigation]);

  const handleCameraPress = useCallback(() => {
    navigation.navigate("AddPhoto");
  }, [navigation]);

  const handleDetailsPress = useCallback(() => {
    navigation.navigate("ObservationDetails", { question: 1 });
  }, [navigation]);

  const handlePhotoPress = useCallback(
    (photoIndex: number, observationId: string) => {
      navigation.navigate("PhotosModal", {
        photoIndex: photoIndex,
        observationId: observationId,
        editing: true,
      });
    },
    [navigation]
  );

  const [{ preset }] = useDraftObservation();

  return (
    <ObservationEditView
      isNew={!observationId}
      onPressCategory={handleCategoryPress}
      onPressCamera={handleCameraPress}
      onPressDetails={handleDetailsPress}
      onPressPhoto={handlePhotoPress}
      preset={preset}
    />
  );
};

export default ObservationEdit;