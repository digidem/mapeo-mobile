// @flow
import React, { useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { TabView } from "react-native-tab-view";

import IconButton from "../../sharedComponents/IconButton";
import { CloseIcon } from "../../sharedComponents/icons";
import { filterPhotosFromAttachments } from "../../lib/utils";
import useObservation from "../../hooks/useObservation";
import useDraftObservation from "../../hooks/useDraftObservation";
import PhotoView from "./PhotoView";
import api from "../../api";
import type { NavigationProp } from "../../types";

const PhotosModal = ({ navigation }: { navigation: NavigationProp }) => {
  const observationId = navigation.getParam("observationId");
  const [index, setIndex] = useState(navigation.getParam("photoIndex") || 0);
  const [{ observation }] = useObservation(observationId);
  const [{ photos: draftPhotos }] = useDraftObservation();

  const routes = [];

  if (observation) {
    const savedPhotosRoutes = filterPhotosFromAttachments(
      observation.value.attachments
    ).map((savedPhoto, idx) => ({
      key: savedPhoto.id,
      uri: api.getMediaUrl(savedPhoto.id, "preview")
    }));
    Array.prototype.push.apply(routes, savedPhotosRoutes);
  }
  if (draftPhotos) {
    const draftPhotosRoutes = draftPhotos
      // $FlowFixMe
      .filter(draftPhoto => !draftPhoto.id)
      .map((draftPhoto, idx) => ({
        key: idx,
        // $FlowFixMe
        uri: draftPhoto.previewUri,
        // $FlowFixMe
        error: draftPhoto.error,
        // $FlowFixMe
        capturing: draftPhoto.capturing
      }));
    Array.prototype.push.apply(routes, draftPhotosRoutes);
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          onPress={() => {
            navigation.pop();
          }}
        >
          <CloseIcon color="white" />
        </IconButton>
      </View>
      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={({ route }) => {
          let variant = "photo";
          if (route.error) variant = "error";
          if (route.capturing) variant = "loading";
          return (
            <PhotoView key={route.uri} uri={route.uri} variant={variant} />
          );
        }}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={() => null}
      />
    </View>
  );
};

export default PhotosModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  header: {
    position: "absolute",
    zIndex: 1,
    height: 60,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  }
});
