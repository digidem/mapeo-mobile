// @flow
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { defineMessages, useIntl } from "react-intl";

import { TouchableHighlight } from "../../sharedComponents/Touchables";
import useObservation from "../../hooks/useObservation";
import { CategoryCircleIcon } from "../../sharedComponents/icons";
import DateDistance from "../../sharedComponents/DateDistance";
import { filterPhotosFromAttachments } from "../../lib/utils";
import PhotoView from "../../sharedComponents/PhotoView";
import api from "../../api";
import type { Style } from "../../types";
import type { SavedPhoto } from "../../context/DraftObservationContext";

const m = defineMessages({
  defaultObservationName: {
    id: "screens.ObservationsList.ObservationListItem.defaultObservationName",
    defaultMessage: "Observation",
    description: "Default name for an observation that does not match a preset"
  }
});

type Props = {
  onPress: string => any,
  style?: Style<typeof View>,
  observationId: string
};

const photoOverlap = 10;

const PhotoStack = ({ photos }: { photos: SavedPhoto[] }) => {
  return (
    <View
      style={{
        width: 60 + (photos.length - 1) * photoOverlap,
        height: 60,
        backgroundColor: "aqua"
      }}>
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
  observationId
}: Props) => {
  const { formatMessage: t } = useIntl();
  const [{ observation, preset }] = useObservation(observationId);
  const name = preset ? preset.name : t(m.defaultObservationName);
  const iconId = preset && preset.icon;
  const createdDate =
    observation && observation.created_at
      ? new Date(observation.created_at)
      : undefined;
  const photos = filterPhotosFromAttachments(
    observation && observation.value.attachments
  ).slice(0, 3);
  console.log("PHOTO", observation && observation.value.attachments);
  return (
    <TouchableHighlight
      onPress={() => onPress(observationId)}
      testID={"ObservationListItem:" + observationId}
      style={{ flex: 1, height: 80 }}>
      <View style={[styles.container, style]}>
        <View style={styles.text}>
          <Text style={styles.title}>{name}</Text>
          {createdDate && <DateDistance date={createdDate} />}
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
    height: 80
  },
  text: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  title: { fontSize: 18, fontWeight: "700", color: "black" },
  photoContainer: {
    position: "relative",
    marginRight: -5
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
    borderStyle: "solid"
  },
  smallIcon: { position: "absolute", right: -3, bottom: -3 }
});
