import * as React from "react";
import * as DocumentPicker from "expo-document-picker";
import { defineMessages, useIntl } from "react-intl";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { LIGHT_GREY, MEDIUM_GREY, RED } from "../../../lib/styles";
import { BGMapCard } from "../../../sharedComponents/BGMapCard";
import Button from "../../../sharedComponents/Button";
import Loading from "../../../sharedComponents/Loading";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "../../../sharedComponents/Touchables";
import { NativeNavigationComponent } from "../../../sharedTypes";
import api, { extractHttpErrorResponse } from "../../../api";
import { ErrorIcon } from "../../../sharedComponents/icons";
import {
  BottomSheetContent,
  BottomSheetContentProps,
} from "../../../sharedComponents/BottomSheet";
import { useMapStyles } from "../../../hooks/useMapStyles";

export const DEFAULT_MAP_ID = "default";

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
  BackgroundMapTitle: {
    id: "screens.Settings.MapSettings.BackgroundMapTitle",
    defaultMessage: "Background Maps",
  },
  deleteMapTitle: {
    id: "screens.Settings.MapSettings.deleteMapTitle",
    defaultMessage: "Delete Map",
    description: "Title for the delete map modal",
  },
  confirmDelete: {
    id: "screens.Settings.MapSettings.confirmDelete",
    defaultMessage: "Yes, Delete",
    description: "Confirm delete map modal button",
  },
  importErrorTitle: {
    id: "screens.Settings.MapSettings.importErrorTitle",
    defaultMessage: "Import Error",
    description: "Title for import error in bottom sheet content",
  },
  importErrorDescription: {
    id: "screens.Settings.MapSettings.importErrorDescription",
    defaultMessage:
      "Unable to import {styleNames}. Re-import the map {fileCount, plural, one {file} other {files}} to try again.",
    description: "Description for import error in bottom sheet content",
  },
  fileErrorDescription: {
    id: "screens.Settings.MapSettings.fileErrorDescription",
    defaultMessage: "Error importing file, please try a different file.",
    description: "Description for file error in bottom sheet content",
  },
  defaultMap: {
    id: "screens.Settings.MapSettings.defaultMap",
    defaultMessage: "Default Map",
    description: "Name of default map",
  },
});

type BottomSheetState = "import" | "file_error" | "import_error";

export const BackgroundMaps: NativeNavigationComponent<"BackgroundMaps"> = () => {
  const { formatMessage: t } = useIntl();

  const [bottomSheetState, setBottomSheetState] = React.useState<
    BottomSheetState
  >("import");

  const {
    onSheetChange,
    isOpen,
    sheetRef,
    snapPoints,
    updateSheetHeight,
    closeSheet,
    expandSheet,
    collapseSheet,
  } = useBottomSheet();

  const { status, styles: stylesList, selectedStyleId } = useMapStyles();

  const {
    add: addMapImports,
    remove: removeMapImports,
  } = useMapImportsManager();

  const stylesWithErroredImport = stylesList.filter(s => s.importInfo?.errored);

  // TODO: Figure out the best way to reshow the bottom sheet when re-entering a screen while an errored import exists
  // Something along the lines of this, which is currently kind of broken.
  // Alternatively, could change the UX such that we visually highlight errored imports and the user has to explicit press it
  // in order to show the modal. At the moment, only issue there is that we need the import id for the pressed style, which we can't guarantee
  // if for example the user closed and re-opened the app.
  //
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (stylesWithErroredImport.length > 0) {
  //       setBottomSheetState("import_error");
  //       expandSheet();
  //     }
  //   }, [stylesWithErroredImport, expandSheet])
  // );

  async function handleImportPress() {
    try {
      const results = await DocumentPicker.getDocumentAsync();

      if (results.type === "cancel") {
        closeSheet();
        return;
      }

      collapseSheet();

      try {
        const { import: tilesetImport } = await api.maps.importTileset(
          results.uri
        );

        // TODO: Once https://github.com/digidem/mapeo-map-server/issues/81 is implemented,
        // no need to call this endpoint and use the last item, etc
        const list = await api.maps.getStyleList();
        const lastStyle = list[list.length - 1];

        addMapImports([
          {
            styleId: lastStyle.id,
            importId: tilesetImport.id,
          },
        ]);

        setBottomSheetState("import");
        closeSheet();
      } catch (err) {
        const parsedError = await extractHttpErrorResponse(err)?.json();

        if (parsedError) {
          if (parsedError.statusCode >= 400 && parsedError.statusCode < 500) {
            setBottomSheetState("file_error");
            expandSheet();
            return;
          }
        }

        setBottomSheetState("import");
        closeSheet();
      }
    } catch (err) {
      setBottomSheetState("file_error");
      expandSheet();
    }
  }

  // Using an IIFE to avoid a lengthy ternary. Not sure how much better this is...
  const bottomSheetContentProps: BottomSheetContentProps = (() => {
    switch (bottomSheetState) {
      case "import": {
        return {
          title: t(m.BackgroundMapTitle),
          buttonConfigs: [
            {
              onPress: () => {
                closeSheet();
              },
              text: t(m.close),
              variation: "outlined",
            },
          ],
          children: (
            <TouchableOpacity
              onPress={handleImportPress}
              style={styles.importButton}
            >
              <View style={styles.importTextAndIcon}>
                <MaterialIcon
                  name="file-upload"
                  size={30}
                  color={MEDIUM_GREY}
                />
                <Text style={styles.text}> {t(m.importFromFile)}</Text>
              </View>
              <Text style={[styles.text, { textAlign: "center" }]}>
                {"( .mbtiles )"}
              </Text>
            </TouchableOpacity>
          ),
        };
      }
      case "file_error": {
        return {
          title: t(m.importErrorTitle),
          icon: <ErrorIcon color={RED} size={90} style={styles.errorIcon} />,
          description: t(m.fileErrorDescription),
          buttonConfigs: [
            {
              onPress: () => {
                closeSheet();
                setBottomSheetState("import");
              },
              text: t(m.close),
              variation: "outlined",
            },
          ],
        };
      }
      case "import_error": {
        return {
          title: t(m.importErrorTitle),
          icon: <ErrorIcon color={RED} size={90} style={styles.errorIcon} />,
          description: t(m.importErrorDescription, {
            styleNames: stylesWithErroredImport
              .map(({ id, name }) => `"${name || id}"`)
              .join(", "),
            fileCount: stylesWithErroredImport.length,
          }),
          buttonConfigs: [
            {
              onPress: async () => {
                try {
                  const erroredStyleIds = stylesWithErroredImport.map(
                    ({ id }) => id
                  );

                  await Promise.all(erroredStyleIds.map(api.maps.deleteStyle));

                  removeMapImports(erroredStyleIds);

                  setBottomSheetState("import");
                } catch (err) {
                  // TODO: Implement better error handling here
                  console.log(err);
                } finally {
                  closeSheet();
                }
              },
              text: t(m.close),
              variation: "outlined",
            },
          ],
        };
      }
    }
  })();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.scrollContentContainer}
        data={status === "loading" && stylesList.length <= 1 ? [] : stylesList}
        ListEmptyComponent={
          <View style={{ marginTop: 40 }}>
            <Loading />
          </View>
        }
        ListHeaderComponent={
          <View style={styles.addMapButtonContainer}>
            <Button
              fullWidth
              onPress={() => {
                expandSheet();
              }}
              variant="outlined"
            >
              {t(m.addBGMap)}
            </Button>
          </View>
        }
        renderItem={({ item }) => (
          <View key={item.id} style={styles.mapCardContainer}>
            <BGMapCard
              importInfo={item.importInfo}
              isSelected={selectedStyleId === item.id}
              mapStyleInfo={item}
            />
          </View>
        )}
      />

      <BottomSheet
        {...DEFAULT_BOTTOM_SHEET_PROPS}
        ref={sheetRef}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.3}
            pressBehavior={isOpen ? "none" : undefined}
          />
        )}
        onChange={onSheetChange}
        snapPoints={snapPoints}
      >
        <BottomSheetView
          onLayout={updateSheetHeight}
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 30,
          }}
        >
          <BottomSheetContent {...bottomSheetContentProps} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

BackgroundMaps.navTitle = m.BackgroundMapTitle;

const styles = StyleSheet.create({
  scrollContentContainer: { paddingHorizontal: 20, paddingVertical: 40 },
  addMapButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mapCardContainer: { paddingVertical: 10 },
  noDownloads: {
    fontSize: 16,
    color: MEDIUM_GREY,
    textAlign: "center",
    marginTop: 20,
  },
  importButton: {
    backgroundColor: LIGHT_GREY,
    padding: 40,
    borderRadius: 8,
  },
  text: { fontSize: 16 },
  importTextAndIcon: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSheetContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  errorIcon: { position: "relative" },
});

const DEFAULT_BOTTOM_SHEET_PROPS = {
  index: -1,
  enableContentPanningGesture: false,
  enableHandlePanningGesture: false,
  handleComponent: () => null,
};

const MIN_SHEET_HEIGHT = 400;

function useSnapPointsCalculator() {
  const [sheetHeight, setSheetHeight] = React.useState(0);

  const { height: windowHeight } = useWindowDimensions();

  const snapPoints = React.useMemo(() => [0, sheetHeight], [sheetHeight]);

  const updateSheetHeight = React.useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      const newSheetHeight = Math.max(
        Math.min(windowHeight * 0.75, height),
        MIN_SHEET_HEIGHT
      );

      setSheetHeight(newSheetHeight);
    },
    [windowHeight]
  );

  return { snapPoints, updateSheetHeight };
}

function useBottomSheet() {
  const [isOpen, setIsOpen] = React.useState(false);
  const bottomSheetRef = React.useRef<BottomSheetMethods>(null);

  const snapProps = useSnapPointsCalculator();

  return {
    ...snapProps,
    sheetRef: bottomSheetRef,
    isOpen,
    onSheetChange(index: number) {
      setIsOpen(index > 0);
    },
    expandSheet() {
      bottomSheetRef.current?.expand();
    },
    collapseSheet() {
      bottomSheetRef.current?.collapse();
    },
    closeSheet() {
      bottomSheetRef.current?.close();
    },
  };
}
