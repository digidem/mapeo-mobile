import * as React from "react";
import { Alert, BackHandler } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { HeaderBackButton } from "react-navigation-stack";
import { useFocusEffect, useNavigation } from "react-navigation-hooks";
import isEqual from "lodash/isEqual";

import { useDraftObservation } from "../hooks/useDraftObservation";
import { useObservation } from "../hooks/useObservation";
import { filterPhotosFromAttachments } from "../lib/utils";
import { CloseIcon, BackIcon } from "./icons";

const m = defineMessages({
  discardTitle: {
    id: "AppContainer.EditHeader.discardTitle",
    defaultMessage: "Discard observation?",
    description: "Title of dialog that shows when cancelling a new observation",
  },
  discardConfirm: {
    id: "AppContainer.EditHeader.discardContent",
    defaultMessage: "Discard without saving",
    description: "Button on dialog to cancel a new observation",
  },
  discardChangesTitle: {
    id: "AppContainer.EditHeader.discardChangesTitle",
    defaultMessage: "Discard changes?",
    description: "Title of dialog that shows when cancelling observation edits",
  },
  discardChangesConfirm: {
    id: "AppContainer.EditHeader.discardChangesContent",
    defaultMessage: "Discard changes",
    description: "Button on dialog to cancel observation edits",
  },
  discardCancel: {
    id: "AppContainer.EditHeader.discardCancel",
    defaultMessage: "Continue editing",
    description: "Button on dialog to keep editing (cancelling close action)",
  },
});

const useBackHandler = (backHandler: () => boolean) => {
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backHandler
      );
      return () => subscription.remove();
    }, [backHandler])
  );
};

const HeaderCloseIcon = ({ tintColor }: { tintColor: string }) => (
  <CloseIcon color={tintColor} />
);

// We use a slightly larger back icon, to improve accessibility
// TODO iOS: This should probably be a chevron not an arrow
const HeaderBackIcon = ({ tintColor }: { tintColor: string }) => (
  <BackIcon color={tintColor} />
);

/**
 * WARNING: Hairy code which could probably be clearer!
 *
 * Currently our UX is different for new observations vs. editing an existing
 * observation. For a new observation, the category chooser is shown first, but
 * after the category is chosen, the user cannot return to it, but instead needs
 * to use the "change category" button.
 *
 * This code will show the close icon in the header if any of these conditions
 * are true:
 *
 * - It is a new observation and the user is on the "ObservationEdit" screen
 * - It is a new observation and the user is on the first "CategoryChoose"
 *   screen, but not when they are they are trying to later change the category
 *   of a new observation
 *
 * The code will request a confirmation if any of these conditions are true:
 *
 * - Any of the conditions above (for showing a close icon)
 * - The user is on the "ObservationEdit" screen for an existing observation
 *   **and** the observation has been edited.
 *
 * Whether the observation has been edited is checked by deep-equal between the
 * draft and the original observation
 */
const CustomHeaderLeft = ({ onPress: originalOnPress, ...props }: any) => {
  const { formatMessage: t } = useIntl();
  const navigation = useNavigation();
  const [draftObservation, { clearDraft }] = useDraftObservation();
  const [{ observation: existingObservation }] = useObservation(
    draftObservation.observationId
  );
  const isNew =
    draftObservation.value &&
    typeof draftObservation.observationId === "undefined";
  const { routeName, key } = navigation.state;
  const parent = navigation.dangerouslyGetParent();
  const routes = parent && parent.state.routes;
  const currentIndex = routes && routes.findIndex(route => route.key === key);
  const prevRouteNameInStack =
    routes &&
    currentIndex &&
    routes[currentIndex - 1] &&
    routes[currentIndex - 1].routeName;

  const shouldConfirm =
    routeName === "ObservationEdit" ||
    (isNew &&
      routeName === "CategoryChooser" &&
      prevRouteNameInStack === "Home");

  const handleCloseRequest = React.useCallback(() => {
    const isUntouched =
      existingObservation &&
      isEqual(existingObservation, draftObservation.value) &&
      isEqual(
        filterPhotosFromAttachments(existingObservation.attachments),
        draftObservation.photos
      );
    if (!shouldConfirm || isUntouched) {
      if (shouldConfirm) clearDraft();
      navigation.goBack();
      return;
    }

    if (isNew) {
      Alert.alert(t(m.discardTitle), undefined, [
        {
          text: t(m.discardConfirm),
          onPress: () => {
            clearDraft();
            navigation.navigate("Home");
          },
        },
        { text: t(m.discardCancel), onPress: () => {} },
      ]);
    } else {
      Alert.alert(t(m.discardChangesTitle), undefined, [
        {
          text: t(m.discardChangesConfirm),
          onPress: () => {
            clearDraft();
            navigation.goBack();
          },
        },
        { text: t(m.discardCancel), onPress: () => {} },
      ]);
    }
  }, [
    clearDraft,
    draftObservation.photos,
    draftObservation.value,
    existingObservation,
    isNew,
    navigation,
    shouldConfirm,
    t,
  ]);

  // Listen to the Android back button
  useBackHandler(
    React.useCallback(() => {
      handleCloseRequest();
      // Return true to denote to BackHandler that we have handled the event
      // See https://reactnavigation.org/docs/en/3.x/custom-android-back-button-handling.html
      return true;
    }, [handleCloseRequest])
  );

  return (
    <HeaderBackButton
      {...props}
      onPress={handleCloseRequest}
      backImage={isNew && shouldConfirm ? HeaderCloseIcon : HeaderBackIcon}
    />
  );
};

export default CustomHeaderLeft;
