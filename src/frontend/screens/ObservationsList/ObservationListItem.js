// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../sharedComponents/Text";

import { TouchableHighlight } from "../../sharedComponents/Touchables";
import useObservation from "../../hooks/useObservation";
import { CategoryCircleIcon } from "../../sharedComponents/icons";
import { filterPhotosFromAttachments } from "../../lib/utils";
import PhotoView from "../../sharedComponents/PhotoView";
import api from "../../api";
import type { ViewStyleProp } from "../../types";
import type { SavedPhoto } from "../../context/DraftObservationContext";
import useDeviceId from "../../hooks/useDeviceId";
import {
  FormattedPresetName,
  FormattedObservationDate,
} from "../../sharedComponents/FormattedData";

type Props = {
  onPress: string => any,
  style?: ViewStyleProp,
  observationId: string,
  testID: string,
};

const photoOverlap = 10;

const PhotoStack = ({ photos }: { photos: SavedPhoto[] }) => {
  return (
    <View
      style={{
        width: 60 + (photos.length - 1) * photoOverlap,
        height: 60,
        backgroundColor: "aqua",
      }}
    >
      {photos.map((photo, idx) => (
        <PhotoView
          key={photo.id}
          uri={api.getMediaUrl(photo.id, "thumbnail")}
          style={[styles.photo, { left: idx * photoOverlap }]}
          resizeMode="cover"
        />
      ))}
    </View>
  );
};

const ObservationListItem = ({
  onPress = () => {},
  style,
  observationId,
  testID,
}: Props) => {
  const [{ observation, preset }] = useObservation(observationId);
  const deviceId = useDeviceId();
  const iconId = preset && preset.icon;
  if (!observation) return null; // Should never get here!

  const photos = filterPhotosFromAttachments(
    observation && observation.value.attachments
  ).slice(0, 3);
  const isMine = observation && observation.value.deviceId === deviceId;
  return (
    <TouchableHighlight
      onPress={() => onPress(observationId)}
      testID={testID}
      style={{ flex: 1, height: 80 }}
    >
      <View
        style={[styles.container, style, !isMine && styles.syncedObservation]}
      >
        <View style={styles.text}>
          <Text style={styles.title}>
            <FormattedPresetName preset={preset} />
          </Text>
          <Text>
            <FormattedObservationDate
              observation={observation}
              variant="relative"
            />
          </Text>
        </View>
        {photos.length ? (
          <View style={styles.photoContainer}>
            <PhotoStack photos={photos} />
            <CategoryCircleIcon
              iconId={iconId}
              size="small"
              style={styles.smallIcon}
            />
          </View>
        ) : (
          <CategoryCircleIcon iconId={iconId} size="medium" />
        )}
      </View>
    </TouchableHighlight>
  );
};

export default React.memo<Props>(ObservationListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    width: "100%",
    paddingHorizontal: 20,
    flex: 1,
    height: 80,
  },
  syncedObservation: {
    borderLeftWidth: 5,
    borderLeftColor: "#3C69F6",
  },
  text: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: { fontSize: 18, fontWeight: "700", color: "black" },
  photoContainer: {
    position: "relative",
    marginRight: -5,
  },
  photo: {
    borderRadius: 5,
    overflow: "hidden",
    position: "absolute",
    width: 60,
    height: 60,
    top: 0,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
  },
  smallIcon: { position: "absolute", right: -3, bottom: -3 },
});
