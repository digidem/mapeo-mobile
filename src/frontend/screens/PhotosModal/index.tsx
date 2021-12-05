import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { NavigationState, TabView, Route } from "react-native-tab-view";

import IconButton from "../../sharedComponents/IconButton";
import Button from "../../sharedComponents/Button";
import { CloseIcon, DeleteIcon } from "../../sharedComponents/icons";
import { filterPhotosFromAttachments } from "../../lib/utils";
import { useObservation } from "../../hooks/useObservation";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import PhotoView from "../../sharedComponents/PhotoView";
import api from "../../api";
import type { NavigationProp } from "../../types";
import { useBottomSheetModal } from "../../sharedComponents/BottomSheetModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import Text from "../../sharedComponents/Text";
import { defineMessages, FormattedMessage } from "react-intl";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables/index.ios";

interface customRoute extends Route {
  uri?: string;
  error?: boolean;
  capturing?: boolean;
}

const m = defineMessages({
  deleteImage: {
    id: "screens.PhotosModal",
    defaultMessage: "Delete Image",
  },
});

const PhotosModal = ({ navigation }: { navigation: NavigationProp }) => {
  const observationId = navigation.getParam("observationId");
  const [index, setIndex] = useState(navigation.getParam("photoIndex") || 0);
  const [{ observation }] = useObservation(observationId);
  const [{ photos: draftPhotos }] = useDraftObservation();
  const [showHeader, setShowHeader] = useState(true);
  const { sheetRef, openSheet, closeSheet } = useBottomSheetModal({
    openOnMount: false,
  });
  const modalIsOpen = useRef<boolean>(false);

  function toggleShowHeader() {
    //we want the header to always show if it is NOT a draft
    if (!!observation) {
      setShowHeader(true);
      return;
    }

    //We don't want to show the header when the modal is open
    if (modalIsOpen.current) {
      setShowHeader(false);
      return;
    }

    setShowHeader(prev => !prev);
  }

  function openModal() {
    modalIsOpen.current = true;
    openSheet();
  }

  function closeModal() {
    modalIsOpen.current = false;
    setShowHeader(true);
    closeSheet();
  }

  const routes: customRoute[] = useMemo(() => {
    if (observation) {
      const savedPhotosRoutes = filterPhotosFromAttachments(
        observation.attachments
      ).map((savedPhoto, idx) => ({
        key: savedPhoto.id,
        uri: api.getMediaUrl(savedPhoto.id, "preview"),
      }));
      return savedPhotosRoutes;
    } else {
      const draftPhotosRoutes = draftPhotos
        .filter(draftPhoto => !("id" in draftPhoto))
        .map((draftPhoto, idx) => ({
          key: idx.toString(),
          uri: "previewUri" in draftPhoto ? draftPhoto.previewUri : undefined,
          error: "error" in draftPhoto ? draftPhoto.error : undefined,
          capturing:
            "capturing" in draftPhoto ? draftPhoto.capturing : undefined,
        }));
      return draftPhotosRoutes;
    }
  }, [observation, draftPhotos]);

  return (
    <View style={styles.container} onTouchEnd={toggleShowHeader}>
      {showHeader && (
        <View style={styles.header}>
          <IconButton
            onPress={() => {
              navigation.pop();
            }}
          >
            <CloseIcon color="white" />
          </IconButton>
          {/* The delete button only show up when creating a NEW observation NOT when editing a saved observation */}
          {!observation && (
            <TouchableNativeFeedback
              style={[styles.button]}
              onPress={openModal}
              variant="outlined"
              color="light"
            >
              <View style={[styles.flexButton]}>
                <DeleteIcon style={[{ marginRight: 10 }]} color="white" />
                <Text style={[{ color: "#FFFFFF" }]}>
                  <FormattedMessage {...m.deleteImage} />
                </Text>
              </View>
            </TouchableNativeFeedback>
          )}
        </View>
      )}

      <TabView
        navigationState={{ index, routes }}
        onIndexChange={ind => {
          setIndex(ind);
          setShowHeader(false);
        }}
        renderScene={({ route }) => {
          let variant: "photo" | "loading" | "error" = "photo";
          if (route.error) variant = "error";
          if (route.capturing) variant = "loading";
          return (
            <PhotoView key={route.uri} uri={route.uri} variant={variant} />
          );
        }}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={() => null}
      />
      <ConfirmDeleteModal
        navigationProp={navigation}
        closeSheet={closeModal}
        sheetRef={sheetRef}
        photoIndex={index}
      />
    </View>
  );
};

PhotosModal.navigationOptions = {
  headerShown: false,
};

export default PhotosModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    position: "absolute",
    zIndex: 1,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    marginTop: 10,
    marginRight: 20,
    color: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  flexButton: {
    flexDirection: "row",
    alignItems: "center",
    color: "white",
  },
});
