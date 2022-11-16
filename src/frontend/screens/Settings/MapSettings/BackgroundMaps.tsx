import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { FlatList, StyleSheet, View } from "react-native";

import MapImportBottomSheet, {
  MapImportBottomSheetMethods,
} from "./MapImportBottomSheet";
import { BGMapCard } from "./BGMapCard";
import Button from "../../../sharedComponents/Button";
import Loading from "../../../sharedComponents/Loading";
import { NativeNavigationComponent } from "../../../sharedTypes";
import { useMapStyles } from "../../../hooks/useMapStyles";

const m = defineMessages({
  addBGMap: {
    id: "screens.Settings.MapSettings.addBGMap",
    defaultMessage: "Add Background Map",
  },
  backgroundMapTitle: {
    id: "screens.Settings.MapSettings.backgroundMapTitle",
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
  const bottomSheetRef = React.useRef<MapImportBottomSheetMethods>(null);

  const { status, styles: mapStyles, selectedStyleId } = useMapStyles();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.scrollContentContainer}
        data={status === "loading" ? [] : mapStyles}
        ListEmptyComponent={ListEmpty}
        ListHeaderComponent={
          <ListHeader onPress={() => bottomSheetRef.current?.open()} />
        }
        renderItem={({ item }) => (
          <View key={item.id} style={styles.mapCardContainer}>
            <BGMapCard {...item} isSelected={selectedStyleId === item.id} />
          </View>
        )}
      />
      <MapImportBottomSheet ref={bottomSheetRef} />
    </View>
  );
};

BackgroundMaps.navTitle = m.backgroundMapTitle;

const styles = StyleSheet.create({
  scrollContentContainer: { paddingHorizontal: 20, paddingVertical: 40 },
  addMapButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mapCardContainer: { paddingVertical: 10 },
});
