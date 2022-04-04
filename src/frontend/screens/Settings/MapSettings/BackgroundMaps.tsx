import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { ScrollView, StyleSheet, Text } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { MEDIUM_GREY } from "../../../lib/styles";
import { BGMapCard } from "../../../sharedComponents/BGMapCard";
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from "../../../sharedComponents/BottomSheetModal";
import Button from "../../../sharedComponents/Button";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";
import Loading from "../../../sharedComponents/Loading";

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
  title: {
    id: "screens.Settings.MapSettings.title",
    defaultMessage: "Background Maps",
  },
  noAreas: {
    id: "screens.Settings.MapSettings.noAreas",
    defaultMessage: "No Downloaded Offline Area",
    description:
      "Message to indicate to user that no offline areas have been downloaded",
  },
});

interface BackgroundMap {
  size: number;
  title: string;
  mapId: string;
}

export const BackgroundMaps: NavigationStackScreenComponent = ({
  navigation,
}) => {
  const { closeSheet, isOpen, openSheet, sheetRef } = useBottomSheetModal({
    openOnMount: false,
  });

  const [backgroundMapList, setBackgroundMapList] = React.useState<
    BackgroundMap[]
  >();

  React.useEffect(() => {
    //To do: get background map list from server
    setBackgroundMapList([]);
  }, []);

  const { formatMessage: t } = useIntl();

  return (
    <React.Fragment>
      <ScrollView style={styles.container}>
        <Button style={[styles.button]} variant="outlined" onPress={openSheet}>
          {t(m.addBGMap)}
        </Button>

        {/* Default BG map card */}
        <BGMapCard
          mapId="D3f4U1t"
          navigation={navigation}
          style={{ marginTop: 20 }}
          mapSize={45}
          mapTitle="Default Map"
        />

        {backgroundMapList === undefined ? (
          <Loading />
        ) : backgroundMapList.length === 0 ? (
          <Text style={styles.noDownloads}>
            <FormattedMessage {...m.noAreas} />
          </Text>
        ) : (
          backgroundMapList.map(bgMap => (
            <BGMapCard
              mapId={bgMap.mapId}
              navigation={navigation}
              mapSize={bgMap.size}
              mapTitle={bgMap.title}
            />
          ))
        )}
      </ScrollView>

      <BackgroundMapModal closeSheet={closeSheet} sheetRef={sheetRef} />
    </React.Fragment>
  );
};

BackgroundMaps.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
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

const styles = StyleSheet.create({
  button: {
    marginTop: 40,
    width: 280,
  },
  noDownloads: {
    fontSize: 16,
    color: MEDIUM_GREY,
    textAlign: "center",
    marginTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
