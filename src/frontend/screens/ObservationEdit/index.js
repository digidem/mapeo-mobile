// @flow
import React, { useCallback } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import ObservationEditView from "./ObservationEditView";
import SaveButton from "./SaveButton";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import useDraftObservation from "../../hooks/useDraftObservation";
import type { NavigationProp } from "../../types";

const m = defineMessages({
  editTitle: {
    id: "screens.ObservationEdit.editTitle",
    defaultMessage: "Edit Observation",
    description: "screen title for edit observation screen"
  },
  newTitle: {
    id: "screens.ObservationEdit.newTitle",
    defaultMessage: "New Observation",
    description: "screen title for new observation screen"
  }
});

const ObservationEdit = ({ navigation }: { navigation: NavigationProp }) => {
  const handleCategoryPress = useCallback(() => {
    navigation.navigate({
      routeName: "CategoryChooser",
      // Set a key here so we don't navigate back in the stack when creating a
      // new observation (which starts with the category chooser screen)
      key: "fromObservationEdit"
    });
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
  headerTitle: (
    <HeaderTitle>
      {navigation.getParam("observationId") ? (
        <FormattedMessage {...m.editTitle} />
      ) : (
        <FormattedMessage {...m.newTitle} />
      )}
    </HeaderTitle>
  ),
  headerRight: <SaveButton navigation={navigation} />
});

export default ObservationEdit;
