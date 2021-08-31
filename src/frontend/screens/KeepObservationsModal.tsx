/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { defineMessages, useIntl } from "react-intl";

import {
  MODAL_NAVIGATION_OPTIONS,
  BottomSheetModal,
  BottomSheetContent,
  useBottomSheetRef,
} from "../sharedComponents/BottomSheetModal";
import ObservationsContext from "../context/ObservationsContext";
import Circle from "../sharedComponents/icons/Circle";
import { ObservationListIcon } from "../sharedComponents/icons";

const m = defineMessages({
  keepMyObservations: {
    id: "screens.KeepMyObservationsModal.keepMyObservations",
    defaultMessage: "Keep my observations",
  },
  keepObservationsExplanation: {
    id: "screens.KeepMyObservationsModal.keepObservationsExplanation",
    defaultMessage: `Bring {observationCount} {observationCount, plural, one {observation} other {observations}} from Practice Mode to the project?`,
  },
  keep: {
    id: "screens.KeepMyObservationsModal.keep",
    defaultMessage: "Yes, Keep",
  },
  delete: {
    id: "screens.KeepMyObservationsModal.delete",
    defaultMessage: "No, Delete",
  },
});

export const KeepObservationsModalContent = ({
  onDelete,
  onKeep,
}: {
  onDelete: () => void;
  onKeep: () => void;
}) => {
  const { formatMessage: t } = useIntl();
  const [{ observations }] = React.useContext(ObservationsContext);

  return (
    <BottomSheetContent
      buttonConfigs={[
        {
          variation: "outlined",
          onPress: onDelete,
          text: t(m.delete),
        },
        {
          variation: "filled",
          onPress: onKeep,
          text: t(m.keep),
        },
      ]}
      description={t(m.keepObservationsExplanation, {
        observationCount: observations.size,
      })}
      icon={
        <Circle radius={40}>
          <ObservationListIcon variant="dark" />
        </Circle>
      }
      title={t(m.keepMyObservations)}
    />
  );
};

export const KeepObservationsModal: NavigationStackScreenComponent = ({
  navigation,
}) => {
  const sheetRef = useBottomSheetRef();

  React.useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.present();
    }
  }, []);

  const createProject = (keepExistingObservations: boolean) => {
    // TODO: do some project creation logic
    navigation.navigate("Map");
  };

  return (
    <BottomSheetModal ref={sheetRef} onDismiss={navigation.goBack}>
      <KeepObservationsModalContent
        onDelete={() => createProject(false)}
        onKeep={() => createProject(true)}
      />
    </BottomSheetModal>
  );
};

KeepObservationsModal.navigationOptions = () => MODAL_NAVIGATION_OPTIONS;
