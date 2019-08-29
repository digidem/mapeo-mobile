// @flow
import React, { useCallback } from "react";

import ObservationEditView from "./ObservationEditView";
import SaveButton from "./SaveButton";
import useDraftObservation from "../../hooks/useDraftObservation";
import type { NavigationProp } from "../../types";

const ObservationEdit = ({ navigation }: { navigation: NavigationProp }) => {
  const handleCategoryPress = useCallback(() => {
    navigation.navigate("CategoryChooser");
  }, [navigation]);

  const handleCameraPress = useCallback(() => {
    navigation.navigate("AddPhoto");
  }, [navigation]);

  const handleDetailsPress = useCallback(() => {
    navigation.navigate("ObservationDetails", { question: 1 });
  }, [navigation]);

  const handlePhotoPress = useCallback(
    (photoIndex: number) => {
      navigation.navigate("PhotosModal", {
        photoIndex: photoIndex,
        observationId: navigation.getParam("observationId"),
        editing: true
      });
    },
    [navigation]
  );

  const [{ preset }] = useDraftObservation();

  return (
    <ObservationEditView
      isNew={navigation.getParam("observationId") === undefined}
      onPressCategory={handleCategoryPress}
      onPressCamera={handleCameraPress}
      onPressDetails={handleDetailsPress}
      onPressPhoto={handlePhotoPress}
      preset={preset}
    />
  );
};

ObservationEdit.navigationOptions = ({
  navigation
}: {
  navigation: NavigationProp
}) => ({
  title: navigation.getParam("observationId") ? "Editar" : "Nueva Observación",
  headerRight: <SaveButton navigation={navigation} />
});

export default ObservationEdit;
