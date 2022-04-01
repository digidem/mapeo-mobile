import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { View } from "react-native";
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from "../../../sharedComponents/BottomSheetModal";
import Button from "../../../sharedComponents/Button";

const m = defineMessages({
  addBGMap: {
    id: "screens.Settings.MapSettings.BackgroundMaps",
    defaultMessage: "Add Background Map",
  },
  close: {
    id: "screens.Settings.MapSettings.close",
    defaultMessage: "Close",
  },
  importFromFile: {
    id: "screens.Settings.MapSettings.importFromFile",
    defaultMessage: "Import from File",
  },
});

export const BackgroundMaps = () => {
  const { closeSheet, isOpen, openSheet, sheetRef } = useBottomSheetModal({
    openOnMount: false,
  });

  return (
    <View>
      <Button onPress={openSheet}>
        <FormattedMessage {...m.addBGMap} />
      </Button>

      <BackgroundMapModal closeSheet={closeSheet} sheetRef={sheetRef} />
    </View>
  );
};

const BackgroundMapModal = ({
  closeSheet,
  sheetRef,
}: {
  closeSheet: () => void;
  sheetRef: React.RefObject<BottomSheetModalMethods>;
}) => {
  const { formatMessage: t } = useIntl();

  return (
    <BottomSheetModal
      disableBackrop={false}
      onDismiss={closeSheet}
      ref={sheetRef}
      onHardwareBackPress={closeSheet}
    >
      <BottomSheetContent
        buttonConfigs={[
          {
            variation: "filled",
            onPress: () => {},
            text: t(m.importFromFile),
          },
          {
            variation: "outlined",
            onPress: closeSheet,
            text: t(m.close),
          },
        ]}
        title={t(m.addBGMap)}
      />
    </BottomSheetModal>
  );
};
