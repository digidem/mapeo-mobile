import * as React from "react";
import * as DocumentPicker from "expo-document-picker";
import { defineMessages, useIntl } from "react-intl";
import { FlatList, StyleSheet, Text, View } from "react-native";

import BottomSheet, {
  MapImportBottomSheetMethods,
} from "./MapImportBottomSheet";
import { LIGHT_GREY, MEDIUM_GREY, RED } from "../../../lib/styles";
import { BGMapCard } from "../../../sharedComponents/BGMapCard";
import Button from "../../../sharedComponents/Button";
import Loading from "../../../sharedComponents/Loading";
import { NativeNavigationComponent } from "../../../sharedTypes";
import { useMapStyles } from "../../../hooks/useMapStyles";

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

const ListEmpty = () => {
  return (
    <View style={{ marginTop: 40 }}>
      <Loading />
    </View>
  );
};

const ListHeader = ({ onPress }: { onPress: () => void }) => {
  const { formatMessage: t } = useIntl();
  return (
    <View style={styles.addMapButtonContainer}>
      <Button fullWidth onPress={onPress} variant="outlined">
        {t(m.addBGMap)}
      </Button>
    </View>
  );
};

export const BackgroundMaps: NativeNavigationComponent<"BackgroundMaps"> = () => {
  const { formatMessage: t } = useIntl();
  const bottomSheetRef = React.useRef<MapImportBottomSheetMethods>();

  const { status, styles, selectedStyleId } = useMapStyles();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.scrollContentContainer}
        data={status === "loading" ? [] : styles}
        ListEmptyComponent={ListEmpty}
        ListHeaderComponent={
          <ListHeader onPress={() => bottomSheetRef.current?.open()} />
        }
        renderItem={({ item }) => (
          <View key={item.id} style={styles.mapCardContainer}>
            <BGMapCard
              isImporting={item.isImporting}
              isSelected={selectedStyleId === item.id}
              mapStyleInfo={item}
            />
          </View>
        )}
      />
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
