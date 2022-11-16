import * as React from "react";
import { StyleSheet, View, Text, LayoutChangeEvent } from "react-native";
import { defineMessages, useIntl } from "react-intl";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import Button from "../../sharedComponents/Button";
import Loading from "../../sharedComponents/Loading";
import { useMapStyles } from "../../hooks/useMapStyles";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { LIGHT_GREY, MAPEO_BLUE } from "../../lib/styles";
import { MapPreviewCard } from "./MapPreviewCard";

const m = defineMessages({
  title: {
    id: "sharedComponents.BGMapSelector.title",
    defaultMessage: "Background Maps",
    description: "Title for the background map selector",
  },
  close: {
    id: "sharedComponents.BGMapSelector.close",
    defaultMessage: "Close",
  },
  manageMaps: {
    id: "sharedComponents.BGMapSelector.manageMaps",
    defaultMessage: "Manage Maps",
  },
});

interface MapSelectorProps {
  /** Should NOT come from `useBottomSheet()` */
  closeSheet: () => void;
}

/** `ref` should NOT come from - `useBottomSheet()` */
export const BGMapSelector = React.forwardRef<
  BottomSheetMethods,
  MapSelectorProps
>(({ closeSheet }, ref) => {
  const { navigate } = useNavigationFromRoot();

  const { formatMessage: t } = useIntl();

  const {
    status,
    styles: stylesList,
    selectedStyleId,
    setSelectedStyleId,
  } = useMapStyles();

  const [snapPoints, setSnapPoints] = React.useState<(number | string)[]>([
    0,
    "40%",
  ]);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setSnapPoints([0, height]);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={BottomSheetBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      handleComponent={() => null}
    >
      <BottomSheetView onLayout={onLayout} style={styles.bottomSheetView}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.title}> {t(m.title)}</Text>
            <Button
              variant="text"
              onPress={() => {
                closeSheet();
                navigate("MapSettings");
              }}
            >
              <Text style={styles.manageMapsButtonText}>{t(m.manageMaps)}</Text>
            </Button>
          </View>
          <View style={styles.mainContentContainer}>
            {status === "loading" ? (
              <View style={styles.loadingContainer}>
                <Loading />
              </View>
            ) : status === "success" ? (
              <ScrollView
                horizontal
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
              >
                {stylesList
                  .filter(({ isImporting }) => !isImporting)
                  .map(({ id, url, name }) => {
                    const isSelected = selectedStyleId === id;
                    return (
                      <View key={id} style={styles.previewCardContainer}>
                        <MapPreviewCard
                          onPress={() => {
                            if (isSelected) return;
                            closeSheet();
                            setSelectedStyleId(id);
                          }}
                          selected={isSelected}
                          styleUrl={url}
                          title={name}
                        />
                      </View>
                    );
                  })}
              </ScrollView>
            ) : null}
          </View>
        </View>

        <View style={styles.closeButtonContainer}>
          <Button fullWidth variant="outlined" onPress={closeSheet}>
            {t(m.close)}
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheetView: { paddingTop: 30 },
  headerContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 20,
    fontWeight: "bold",
  },
  manageMapsButtonText: {
    color: MAPEO_BLUE,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingContainer: { padding: 60 },
  mainContentContainer: { paddingVertical: 20 },
  scrollContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: 20,
  },
  scrollContentContainer: { paddingHorizontal: 10 },
  previewCardContainer: { marginHorizontal: 10 },
  closeButtonContainer: { paddingHorizontal: 40 },
});
