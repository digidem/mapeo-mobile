import * as React from "react";
import * as DocumentPicker from "expo-document-picker";
import { defineMessages, useIntl } from "react-intl";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LIGHT_GREY, MEDIUM_GREY, RED } from "../../../lib/styles";
import { BGMapCard } from "../../../sharedComponents/BGMapCard";
import Button from "../../../sharedComponents/Button";
import Loading from "../../../sharedComponents/Loading";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "../../../sharedComponents/Touchables";
import {
  MapServerStyleInfo,
  NativeNavigationComponent,
} from "../../../sharedTypes";
import api, { extractHttpErrorResponse } from "../../../api";
import { useMapStyle } from "../../../hooks/useMapStyle";
import { useDefaultStyleUrl } from "../../../hooks/useDefaultStyleUrl";
import {
  useBackgroundedMapImports,
  useBackgroundedMapImportsManager,
} from "../../../hooks/useBackgroundedMapImports";
import { ErrorIcon } from "../../../sharedComponents/icons";
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from "../../../sharedComponents/BottomSheetModal";

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

type BottomSheetState = "import" | "loading" | "file_error" | "import_error";

// TODO: We should update the state for the backgroundMapList so that it has a fetch state too
// That way we can provide better messaging and recovery in case errors occur when fetching the list of styles
export const BackgroundMaps: NativeNavigationComponent<"BackgroundMaps"> = () => {
  const { formatMessage: t } = useIntl();

  const importModal = useBottomSheetModal({
    openOnMount: false,
  });

  const errorModal = useBottomSheetModal({
    openOnMount: false,
  });

  const { styleUrl } = useMapStyle();

  const defaultStyleUrl = useDefaultStyleUrl();

  const [bottomSheetState, setBottomSheetState] = React.useState<
    BottomSheetState
  >("import");

  const [backgroundMapList, setBackgroundMapList] = React.useState<
    MapServerStyleInfo[]
  >();

  const [erroredImports, setErroredImports] = React.useState<
    Record<MapServerStyleInfo["id"], MapServerStyleInfo["name"] | undefined>
  >({});

  const backgroundedMapImports = useBackgroundedMapImports();
  const {
    remove: removeImportFromBackground,
  } = useBackgroundedMapImportsManager();

  // TODO: Should be MapServerImport["id"] for value type but need to fix return type in @mapeo/map-server
  const [activeMapImports, setActiveMapImports] = React.useState<
    Record<MapServerStyleInfo["id"], string | undefined>
  >(backgroundedMapImports);

  React.useEffect(() => {
    api.maps
      .getStyleList()
      .then(list => setBackgroundMapList(list))
      .catch(err => {
        console.log("COULD NOT FETCH STYLES", err);
        setBackgroundMapList([]);
      });
  }, []);

  async function handleImportPress() {
    try {
      const results = await DocumentPicker.getDocumentAsync();

      if (results.type === "cancel") {
        importModal.closeSheet();
        return;
      }

      importModal.closeSheet();

      if (results.type === "success") {
        try {
          setBottomSheetState("loading");

          const { import: tilesetImport } = await api.maps.importTileset(
            results.uri
          );

          // TODO: Once https://github.com/digidem/mapeo-map-server/issues/81 is implemented,
          // no need to call this endpoint and use the last item, etc
          const list = await api.maps.getStyleList();
          const lastStyle = list[list.length - 1];

          setActiveMapImports(prev => ({
            ...prev,
            [lastStyle.id]: tilesetImport.id,
          }));

          setBackgroundMapList(list);
          setBottomSheetState("import");
        } catch (err) {
          const parsedError = await extractHttpErrorResponse(err)?.json();

          if (parsedError) {
            if (parsedError.statusCode >= 400 && parsedError.statusCode < 500) {
              setBottomSheetState("file_error");
              errorModal.openSheet();
              return;
            }
          }

          setBottomSheetState("import_error");
          errorModal.openSheet();
        }
      }
    } catch (err) {
      importModal.closeSheet();
      setBottomSheetState("file_error");
      errorModal.openSheet();
    }
  }

  // Using an IIFE to avoid a lengthy ternary. Not sure how much better this is...
  const bottomSheetContentProps: React.ComponentProps<typeof BottomSheetContent> = (function createBottomSheetContentProps() {
    if (bottomSheetState === "import") {
      return {
        title: t(m.BackgroundMapTitle),
        buttonConfigs: [
          {
            onPress: () => {
              importModal.closeSheet();
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
              <MaterialIcon name="file-upload" size={30} color={MEDIUM_GREY} />
              <Text style={styles.text}> {t(m.importFromFile)}</Text>
            </View>
            <Text style={[styles.text, { textAlign: "center" }]}>
              {"( .mbtiles )"}
            </Text>
          </TouchableOpacity>
        ),
      };
    }

    if (bottomSheetState === "loading") {
      return {
        title: t(m.BackgroundMapTitle),
        buttonConfigs: [],
        children: (
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Loading />
          </View>
        ),
      };
    }

    // Return import skeleton if state is an error state
    return {
      title: t(m.BackgroundMapTitle),
      buttonConfigs: [
        { text: t(m.close), variation: "outlined", onPress: () => {} },
      ],
    };
  })();

  const errorBottomSheetContentProps:
    | React.ComponentProps<typeof BottomSheetContent>
    | undefined = (function createErrorBottomSheetContentProps() {
    if (bottomSheetState === "file_error") {
      return {
        title: t(m.importErrorTitle),
        icon: <ErrorIcon color={RED} size={90} style={styles.errorIcon} />,
        description: t(m.fileErrorDescription),
        buttonConfigs: [
          {
            onPress: () => {
              errorModal.closeSheet();
              setBottomSheetState("import");
            },
            text: t(m.close),
            variation: "outlined",
          },
        ],
      };
    }

    if (bottomSheetState === "import_error") {
      return {
        title: t(m.importErrorTitle),
        icon: <ErrorIcon color={RED} size={90} style={styles.errorIcon} />,
        description: t(m.importErrorDescription, {
          styleNames: Object.entries(erroredImports)
            .map(([styleId, styleName]) => `"${styleName || styleId}"`)
            .join(", "),
          fileCount: Object.keys(erroredImports).length,
        }),
        buttonConfigs: [
          {
            onPress: async () => {
              try {
                await Promise.all(
                  Object.keys(erroredImports).map(api.maps.deleteStyle)
                );

                errorModal.closeSheet();

                setBottomSheetState("import");
                setErroredImports({});
                setBackgroundMapList(await api.maps.getStyleList());
              } catch (err) {
                // TODO: Implement better error handling here
                console.log(err);
              } finally {
                errorModal.closeSheet();
              }
            },
            text: t(m.close),
            variation: "outlined",
          },
        ],
      };
    }

    // Return import skeleton if state is an error state
    return {
      title: t(m.importErrorTitle),
      icon: <ErrorIcon color={RED} size={90} style={styles.errorIcon} />,
      buttonConfigs: [
        { text: t(m.close), variation: "outlined", onPress: () => {} },
      ],
    };
  })();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.scrollContentContainer}
        data={backgroundMapList}
        ListEmptyComponent={
          backgroundMapList === undefined ? (
            <View style={{ marginTop: 40 }}>
              <Loading />
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View>
            <View style={styles.addMapButtonContainer}>
              <Button
                fullWidth
                onPress={() => {
                  importModal.openSheet();
                }}
                variant="outlined"
              >
                {t(m.addBGMap)}
              </Button>
            </View>
            {/* Default BG map card */}
            {defaultStyleUrl && (
              <View style={styles.mapCardContainer}>
                <BGMapCard
                  isSelected={styleUrl === defaultStyleUrl}
                  mapStyleInfo={{
                    id: DEFAULT_MAP_ID,
                    url: defaultStyleUrl,
                    bytesStored: 0,
                    name: t(m.defaultMap),
                  }}
                />
              </View>
            )}
          </View>
        }
        renderItem={({ item: bgMap }) => {
          async function onImportComplete() {
            removeImportFromBackground(bgMap.id);

            return api.maps
              .getStyleList()
              .then(list => {
                setBackgroundMapList(list);
              })
              .catch(err => {
                console.error(err);
              })
              .finally(() => {
                setActiveMapImports(prev => {
                  const updated = { ...prev };
                  delete updated[bgMap.id];
                  return updated;
                });
              });
          }

          function onImportError() {
            setErroredImports(prev => ({
              ...prev,
              [bgMap.id]: bgMap.name,
            }));

            setBottomSheetState("import_error");
            errorModal.openSheet();
          }

          return (
            <View key={bgMap.id} style={styles.mapCardContainer}>
              <BGMapCard
                activeImportId={activeMapImports[bgMap.id]}
                isSelected={styleUrl === bgMap.url}
                mapStyleInfo={bgMap}
                onImportError={onImportError}
                onImportComplete={onImportComplete}
              />
            </View>
          );
        }}
      />

      <BottomSheetModal ref={importModal.sheetRef} onDismiss={() => {}}>
        <BottomSheetContent {...bottomSheetContentProps} />
      </BottomSheetModal>

      <BottomSheetModal ref={errorModal.sheetRef} onDismiss={() => {}}>
        <BottomSheetContent {...errorBottomSheetContentProps} />
      </BottomSheetModal>
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
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 5,
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
