import * as React from "react";
// import {
//   BottomSheetBackdrop,
//   BottomSheetModal,
//   BottomSheetModalProvider,
//   BottomSheetView,
// } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { StyleSheet, View, Text } from "react-native";
import { MAPEO_BLUE, RED, WHITE } from "../../../lib/styles";
import { DeleteIcon, ErrorIcon } from "../../../sharedComponents/icons";
import Button from "../../../sharedComponents/Button";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import api from "../../../api";
import { useNavigationFromRoot } from "../../../hooks/useNavigationWithTypes";
import { useMapStyle } from "../../../hooks/useMapStyle";
import { DEFAULT_MAP_ID } from "./BackgroundMaps";
import {
  BottomSheetModal,
  BottomSheetContent,
} from "../../../sharedComponents/BottomSheetModal";

const m = defineMessages({
  deleteMapMessage: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.deleteMapMessage",
    defaultMessage: "Are you sure you want to delete {mapName}?",
  },
  deleteMapWarning: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.deleteMapWarning",
    defaultMessage:
      "This area will no longer be available offline. Cannot be undone.",
  },
  deleteMap: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.deleteMap",
    defaultMessage: "Delete Map",
  },
  cancel: {
    id: "screens.Settings.MapSettings.DeleteMapBottomSheet.cancel",
    defaultMessage: "Cancel",
  },
});

interface DeleteMapBottomSheetProps {
  mapName: string;
  mapId: string;
  closeSheet: () => void;
}

export const DeleteMapBottomSheet = React.forwardRef<
  BottomSheetModalMethods,
  DeleteMapBottomSheetProps
>(({ mapName, closeSheet, mapId }, sheetRef) => {
  const { navigate } = useNavigationFromRoot();
  const { formatMessage: t } = useIntl();
  const { styleId, setStyleId } = useMapStyle();

  function deleteMap() {
    // Cannot delete Default Map
    if (mapId === DEFAULT_MAP_ID) {
      return;
    }

    api.maps
      .deleteStyle(mapId)
      .then(() => {
        // If user is deleting the map that is currently being used, we want to set the map to be the default map
        if (styleId === mapId) {
          setStyleId(DEFAULT_MAP_ID);
        }
        navigate("BackgroundMaps");
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <BottomSheetModal ref={sheetRef} onDismiss={closeSheet}>
      <BottomSheetContent
        title={
          <FormattedMessage
            {...m.deleteMapMessage}
            values={{ mapName: mapName }}
          />
        }
        description={t(m.deleteMapWarning)}
        icon={
          <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />
        }
        buttonConfigs={[
          {
            text: (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DeleteIcon color={WHITE} />
                <Text style={[styles.deleteButton, { color: WHITE }]}>
                  {t(m.deleteMap)}
                </Text>
              </View>
            ),
            variation: "filled",
            onPress: deleteMap,
          },
          {
            text: t(m.cancel),
            variation: "outlined",
            onPress: closeSheet,
          },
        ]}
      />
    </BottomSheetModal>

    // <BottomSheetModalProvider>
    //   <BottomSheetModal
    //     ref={sheetRef}
    //     snapPoints={snapPoints}
    //     backdropComponent={BottomSheetBackdrop}
    //     enableContentPanningGesture={false}
    //     enableHandlePanningGesture={false}
    //     index={0}
    //     handleComponent={() => null}
    //   >
    //     <BottomSheetView
    //       onLayout={e => {
    //         const { height } = e.nativeEvent.layout;
    //         setSnapPoints([0, height]);
    //       }}
    //       style={styles.btmSheetContainer}
    //     >
    //       <ErrorIcon style={{ position: "relative" }} size={90} color={RED} />

    //       <Text style={{ fontSize: 24, textAlign: "center", margin: 10 }}>
    //         <FormattedMessage
    //           {...m.deleteMapMessage}
    //           values={{ mapName: mapName }}
    //         />
    //       </Text>

    //       <Text>
    //         <FormattedMessage {...m.deleteMapWarning} />
    //       </Text>

    //       <Button
    //         onPress={deleteMap}
    //         fullWidth
    //         color="dark"
    //         style={{ backgroundColor: RED, marginTop: 30, marginBottom: 20 }}
    //       >
    // <View
    //   style={{
    //     display: "flex",
    //     flexDirection: "row",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <DeleteIcon color={WHITE} />
    //   <Text style={[styles.deleteButton, { color: WHITE }]}>
    //     {t(m.deleteMap)}
    //   </Text>
    // </View>
    //       </Button>
    //       <Button onPress={closeSheet} fullWidth variant="outlined">
    //         <Text style={[styles.deleteButton, { color: MAPEO_BLUE }]}>
    //           {t(m.cancel)}
    //         </Text>
    //       </Button>
    //     </BottomSheetView>
    //   </BottomSheetModal>
    // </BottomSheetModalProvider>
  );
});

const styles = StyleSheet.create({
  btmSheetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  deleteButton: {
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: 16,
  },
});
