import React, { useEffect, useRef, useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { TabView } from "react-native-tab-view";

import IconButton from "../../sharedComponents/IconButton";
import Button from "../../sharedComponents/Button";
import { CloseIcon } from "../../sharedComponents/icons";
import { filterPhotosFromAttachments } from "../../lib/utils";
import { useObservation } from "../../hooks/useObservation";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import PhotoView from "../../sharedComponents/PhotoView";
import api from "../../api";
import type { NavigationProp } from "../../types";
import { useBottomSheetModal } from "../../sharedComponents/BottomSheetModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { DraftPhoto } from "../../context/DraftObservationContext";

const PhotosModal = ({ navigation }: { navigation: NavigationProp }) => {
  const observationId = navigation.getParam("observationId");
  const [index, setIndex] = useState(navigation.getParam("photoIndex") || 0);
  const [{ observation }] = useObservation(observationId);
  const [{ photos: draftPhotos }] = useDraftObservation();
  const [showHeader, setShowHeader] = useState(false);
  const { sheetRef, openSheet, closeSheet } = useBottomSheetModal({
    openOnMount: false,
  });
  const modalIsOpen = useRef<boolean>(false);

  //We don't want to show the header when the modal is open, these functions
  //check if the modal is open before trying to show header
  function toggleShowHeader() {
    if (modalIsOpen.current) {
      setShowHeader(false);
      return;
    }
    setShowHeader(!showHeader);
  }

  function openModal() {
    modalIsOpen.current = true;
    openSheet();
  }

  function closeModal() {
    modalIsOpen.current = false;
    closeSheet();
  }

  const routes: any[] = [];

  if (observation) {
    const savedPhotosRoutes = filterPhotosFromAttachments(
      observation.attachments
    ).map((savedPhoto, idx) => ({
      key: savedPhoto.id,
      uri: api.getMediaUrl(savedPhoto.id, "preview"),
    }));
    Array.prototype.push.apply(routes, savedPhotosRoutes);
  }
  if (draftPhotos) {
    const draftPhotosRoutes = draftPhotos
      .filter(draftPhoto => "id" in draftPhoto)
      .map((draftPhoto, idx) => ({
        key: idx,
        uri: "previewUri" in draftPhoto ? draftPhoto.previewUri : undefined,
        error: "error" in draftPhoto ? draftPhoto.error : undefined,
        capturing: "capturing" in draftPhoto ? draftPhoto.capturing : undefined,
      }));
    Array.prototype.push.apply(routes, draftPhotosRoutes);
  }
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
          <Button onPress={openModal}>Delete Photo</Button>
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
    height: 60,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
