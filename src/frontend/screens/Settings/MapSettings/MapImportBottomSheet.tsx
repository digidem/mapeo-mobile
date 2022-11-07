import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as DocumentPicker from "expo-document-picker";

import { TouchableOpacity } from "../../../sharedComponents/Touchables";
import { LIGHT_GREY, MEDIUM_GREY, RED } from "../../../lib/styles";
import { BottomSheetContent } from "../../../sharedComponents/BottomSheet";
import { ErrorIcon } from "../../../sharedComponents/icons";
import api, { extractHttpErrorResponse } from "../../../api";
import { useMapImportsManager } from "../../../hooks/useMapImports";

const MIN_SHEET_HEIGHT = 400;

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

/**
 * Bottom sheet content for the user to select a file to import
 */
const SelectImportContent = ({
  onPressImport,
  onPressClose,
}: {
  onPressImport: () => void;
  onPressClose: () => void;
}) => {
  const { formatMessage: t } = useIntl();
  return (
    <BottomSheetContent
      title={t(m.BackgroundMapTitle)}
      buttonConfigs={[
        {
          onPress: onPressClose,
          text: t(m.close),
          variation: "outlined",
        },
      ]}
    >
      <TouchableOpacity onPress={onPressImport} style={styles.importButton}>
        <View style={styles.importTextAndIcon}>
          <MaterialIcon name="file-upload" size={30} color={MEDIUM_GREY} />
          <Text style={styles.text}> {t(m.importFromFile)}</Text>
        </View>
        <Text style={[styles.text, { textAlign: "center" }]}>
          {"( .mbtiles )"}
        </Text>
      </TouchableOpacity>
    </BottomSheetContent>
  );
};

/**
 * Bottom sheet content for when an imported file is processing, checking the
 * format etc. is correct (shows until the import endpoint returns with the
 * import id). User is unable to close this sheet.
 */
const ImportingContent = () => {
  return <BottomSheetContent title="Processing file..." buttonConfigs={[]} />;
};

/**
 * Bottom sheet content for when there is an error with the selected file
 */
const FileErrorContent = ({ onPressClose }: { onPressClose: () => void }) => {
  const { formatMessage: t } = useIntl();
  return (
    <BottomSheetContent
      title={t(m.importErrorTitle)}
      icon={<ErrorIcon color={RED} size={90} style={styles.errorIcon} />}
      description={t(m.fileErrorDescription)}
      buttonConfigs={[
        {
          onPress: onPressClose,
          text: t(m.close),
          variation: "outlined",
        },
      ]}
    />
  );
};

type BottomSheetStates = "select" | "importing" | "error";

export interface MapImportBottomSheetMethods {
  /** Open the bottom sheet by expanding it to its maximum snap point */
  open: () => void;
}

/** Custom backdrop that will close sheet when pressed */
const BackdropPressable = (props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop {...props} opacity={0.3} pressBehavior={"close"} />
  );
};

/** Custom backdrop that will not close sheet when pressed */
const BackdropNonPressable = (props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop {...props} opacity={0.3} pressBehavior={"none"} />
  );
};

const MapImportBottomSheet = React.forwardRef<MapImportBottomSheetMethods, {}>(
  (props, ref) => {
    const [state, setState] = React.useState<BottomSheetStates>("select");
    const bottomSheetRef = React.useRef<BottomSheetMethods>(null);
    const { snapPoints, updateSheetHeight } = useSnapPointsCalculator();
    const { add: addMapImport } = useMapImportsManager();

    React.useImperativeHandle(ref, () => {
      return {
        open: () => bottomSheetRef.current?.expand(),
      };
    });

    const closeSheet = () => {
      // Set state on close so when it opens again this is what you see
      setState("select");
      bottomSheetRef.current?.close();
    };

    const handlePressImport = async () => {
      setState("importing");
      let results;
      try {
        results = await DocumentPicker.getDocumentAsync();
      } catch (err) {
        setState("error");
        return;
      }

      if (results.type === "cancel") {
        closeSheet();
        return;
      }

      try {
        const {
          import: { id: importId },
        } = await api.maps.importTileset(results.uri);

        // TODO: Once https://github.com/digidem/mapeo-map-server/issues/81 is
        // implemented, no need to call this endpoint and use the last item,
        // etc. We need to do this because we don't yet have an endpoint on the
        // server for active imports, so we need to maintain our own state of
        // active imports.
        const list = await api.maps.getStyleList();
        const { id: styleId } = list[list.length - 1];
        addMapImport({ styleId, importId });

        closeSheet();
      } catch (err) {
        console.log("IMPORT ERROR", err);
        const parsedError = await extractHttpErrorResponse(err)?.json();

        if (
          parsedError &&
          parsedError.statusCode >= 400 &&
          parsedError.statusCode < 500
        ) {
          setState("error");
          return;
        }

        // TODO: How to handle different kind of error?
        closeSheet();
      }
    };

    const BackdropComponent =
      state === "importing" ? BackdropNonPressable : BackdropPressable;

    const bottomSheetContent =
      state === "select" ? (
        <SelectImportContent
          onPressClose={closeSheet}
          onPressImport={handlePressImport}
        />
      ) : state === "importing" ? (
        <ImportingContent />
      ) : (
        <FileErrorContent onPressClose={closeSheet} />
      );

    return (
      <BottomSheet
        index={-1}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={() => null}
        ref={bottomSheetRef}
        backdropComponent={BackdropComponent}
        snapPoints={snapPoints}
      >
        <BottomSheetView
          onLayout={updateSheetHeight}
          style={styles.bottomSheetView}
        >
          {bottomSheetContent}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default MapImportBottomSheet;

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

const styles = StyleSheet.create({
  bottomSheetView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
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
