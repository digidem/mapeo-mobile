// @flow
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { defineMessages, useIntl } from "react-intl";

import { TouchableHighlight } from "../../sharedComponents/Touchables";
import useObservation from "../../hooks/useObservation";
import { CategoryCircleIcon } from "../../sharedComponents/icons";
import DateDistance from "../../sharedComponents/DateDistance";
import { getLastPhotoAttachment } from "../../lib/utils";
import PhotoView from "../../sharedComponents/PhotoView";
import api from "../../api";
import type { Style } from "../../types";

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
  const photo = getLastPhotoAttachment(
    observation && observation.value.attachments
  );
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
        {photo && photo.id ? (
          <View style={styles.photoContainer}>
            <PhotoView
              uri={api.getMediaUrl(photo.id, "thumbnail")}
              style={styles.photo}
              resizeMode="cover"
            />
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
    width: 60,
    height: 60,
    position: "relative",
    marginRight: -5
  },
  photo: { borderRadius: 5, overflow: "hidden" },
  smallIcon: { position: "absolute", right: -3, bottom: -3 }
});
