import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { ScrollView, StyleSheet, Text } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { RED } from "../../../lib/styles";
import {
  BottomSheetContent,
  BottomSheetModal,
} from "../../../sharedComponents/BottomSheetModal";
import Button from "../../../sharedComponents/Button";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";
import { OfflineAreaCard } from "../../../sharedComponents/OfflineAreaCard";

const m = defineMessages({
  title: {
    id: "screens.Settings.MapSettings.OfflineArea",
    defaultMessage: "Offline Areas",
  },
  removeMap: {
    id: "screens.Settings.MapSettings.removeMap",
    defaultMessage: "Remove Map",
  },
  close: {
    id: "screens.Settings.MapSettings.close",
    defaultMessage: "Close",
  },
});

export const OfflineAreas: NavigationStackScreenComponent = ({
  navigation,
}) => {
  const bgMapId = React.useRef("");
  const { formatMessage: t } = useIntl();

  const { getParam } = navigation;

  React.useEffect(() => {
    bgMapId.current = getParam("mapId", "");
    //
  }, []);

  return (
    <React.Fragment>
      <ScrollView style={[styles.container]}>
        <OfflineAreaCard
          title={"Title"}
          zoomLevel={44}
          lvlOfDetail="Small Roads"
        />
      </ScrollView>
      <Button style={styles.button} onPress={() => {}}>
        {t(m.removeMap)}
      </Button>
    </React.Fragment>
  );
};

OfflineAreas.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
};

const DeleteAreaModal = ({
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
            text: "",
          },
          {
            variation: "outlined",
            onPress: closeSheet,
            text: t(m.close),
          },
        ]}
        title=""
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  button: {
    backgroundColor: RED,
    width: 280,
    marginBottom: 20,
  },
});
