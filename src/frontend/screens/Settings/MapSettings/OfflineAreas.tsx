import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet } from "react-native";
import api from "../../../api";

import { RED } from "../../../lib/styles";
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from "../../../sharedComponents/BottomSheetModal";
import Button from "../../../sharedComponents/Button";
import { ErrorIcon } from "../../../sharedComponents/icons";
import { NativeNavigationComponent } from "../../../sharedTypes";

const m = defineMessages({
  title: {
    id: "screens.Settings.MapSettings.OfflineArea",
    defaultMessage: "Offline Areas",
  },
  removeMap: {
    id: "screens.Settings.MapSettings.removeMap",
    defaultMessage: "Remove Map",
  },
  cancel: {
    id: "screens.Settings.MapSettings.cancel",
    defaultMessage: "Cancel",
  },
  clearDiagrams: {
    id: "screens.Settings.MapSettings.clearDiagrams",
    defaultMessage: "Are you sure you want to delete map?",
  },
  subtitle: {
    id: "screens.Settings.MapSettings.subtitle",
    defaultMessage:
      "This map and offline areas attached to it will be deleted. This cannot be undone",
  },
});

interface OfflineArea {
  id: string;
  title: string;
  zoomLevel: number;
}

export const OfflineAreas: NativeNavigationComponent<"OfflineAreas"> = ({
  route,
  navigation
}) => {
  const { formatMessage: t } = useIntl();

  const { closeSheet, openSheet, sheetRef } = useBottomSheetModal({
    openOnMount: false,
  });

  const { mapId } = route.params;

  return (
    <React.Fragment>
      {/* <ScrollView style={[styles.container]}>
        {offlineAreaList === undefined ? (
          <Loading />
        ) : (
          offlineAreaList.map((offlineArea: OfflineArea, ind) => (
            <OfflineAreaCard
              key={offlineArea.id}
              title={offlineArea.title}
              zoomLevel={offlineArea.zoomLevel}
              position={ind}
            />
          ))
        )}
      </ScrollView> */}

      <Button style={styles.button} onPress={openSheet}>
        {t(m.removeMap)}
      </Button>

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
              dangerous: true,

              onPress: () => {
                if (typeof mapId === "string") {
                  api.maps
                    .deleteStyle(mapId)
                    .then(() => {
                      navigation.goBack();
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              },

              text: t(m.removeMap),
            },
            {
              variation: "outlined",
              onPress: closeSheet,
              text: t(m.cancel),
            },
          ]}
          icon={
            <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />
          }
          title={t(m.clearDiagrams)}
          description={t(m.subtitle)}
        />
      </BottomSheetModal>
    </React.Fragment>
  );
};

OfflineAreas.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  button: {
    backgroundColor: RED,
    width: 280,
    marginBottom: 20,
    marginTop: 40,
  },
});
