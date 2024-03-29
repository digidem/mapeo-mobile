import React from "react";
import { Alert } from "react-native";
import Text from "../../sharedComponents/Text";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import ObservationView from "./ObservationView";
import CenteredView from "../../sharedComponents/CenteredView";
import { useObservation } from "../../hooks/useObservation";
import ObservationHeaderRight from "./ObservationHeaderRight";
import { NativeNavigationComponent } from "../../sharedTypes";

const m = defineMessages({
  notFound: {
    id: "screens.Observation.notFound",
    defaultMessage: "Observation not found",
    description: "Message shown when an observation is not found",
  },
  deleteTitle: {
    id: "screens.Observation.deleteTitle",
    defaultMessage: "Delete observation?",
    description: "Title of dialog asking confirmation to delete an observation",
  },
  cancel: {
    id: "screens.Observation.cancel",
    defaultMessage: "Cancel",
    description: "Button to cancel delete of observation",
  },
  confirm: {
    id: "screens.Observation.confirm",
    defaultMessage: "Yes, delete",
    description: "Button to confirm delete of observation",
  },
  title: {
    id: "screens.Observation.title",
    defaultMessage: "Observation",
    description:
      "Title of observation screen showing (non-editable) view of observation with map and answered questions",
  },
});

// TODO: Add a better message for the user.
// In the future if we add deep-linking we could get here,
// otherwise we should never reach here unless there is a bug in the code
const ObservationNotFound = () => (
  <CenteredView>
    <Text>
      <FormattedMessage {...m.notFound} />
    </Text>
  </CenteredView>
);

const Observation: NativeNavigationComponent<"Observation"> = ({
  route,
  navigation,
}) => {
  const { observationId } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ObservationHeaderRight observationId={observationId} />
      ),
    });
  }, [navigation, observationId]);

  const { formatMessage: t } = useIntl();

  const [
    // TODO: handle loadingStatus and deletingStatus state
    { observation, preset },
    deleteObservation,
  ] = useObservation(observationId);

  function handlePressPhoto(photoIndex: number) {
    navigation.navigate("PhotosModal", {
      photoIndex: photoIndex,
      observationId: observationId,
      editing: false,
    });
  }

  function handlePressDelete() {
    Alert.alert(t(m.deleteTitle), undefined, [
      {
        text: t(m.cancel),
        onPress: () => {},
      },
      {
        text: t(m.confirm),
        onPress: () => {
          deleteObservation();
          navigation.pop();
        },
      },
    ]);
  }

  if (!observation) return <ObservationNotFound />;

  return (
    <ObservationView
      observation={observation}
      preset={preset}
      onPressPhoto={handlePressPhoto}
      onPressDelete={handlePressDelete}
    />
  );
};

Observation.navTitle = m.title;

export default Observation;
