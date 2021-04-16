// @flow
import * as React from "react";

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Share,
  Image,
  Dimensions,
} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import ShareMedia from "react-native-share";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { defineMessages, useIntl } from "react-intl";

import api from "../../api";
import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
import { CategoryCircleIcon } from "../../sharedComponents/icons";
import mapIcon from "../../images/observation-icon.png";
import { filterPhotosFromAttachments, getProp } from "../../lib/utils";
import {
  BLACK,
  RED,
  WHITE,
  DARK_GREY,
  LIGHT_GREY,
  MEDIUM_GREY,
} from "../../lib/styles";
import { TouchableOpacity } from "../../sharedComponents/Touchables";
import type { PresetWithFields } from "../../context/ConfigContext";
import type { Observation } from "../../context/ObservationsContext";
import useMapStyle from "../../hooks/useMapStyle";
import useDeviceId from "../../hooks/useDeviceId";
import useSettingsValue from "../../hooks/useSettingsValue";
import Loading from "../../sharedComponents/Loading";
import OfflineMapLayers from "../../sharedComponents/OfflineMapLayers";
import { ShareMessage, ShareSubject, renderToString } from "./ObservationShare";
import {
  FormattedCoords,
  FormattedFieldValue,
  FormattedPresetName,
  FormattedFieldProp,
  FormattedObservationDate,
} from "../../sharedComponents/FormattedData";

const m = defineMessages({
  share: {
    id: "screens.Observation.ObservationView.share",
    defaultMessage: "Share",
    description: "Button to share an observation",
  },
  delete: {
    id: "screens.Observation.ObservationView.delete",
    defaultMessage: "Delete",
    description: "Button to delete an observation",
  },
});

type ButtonProps = {
  onPress: () => any,
  color: string,
  iconName: "delete" | "share",
  title: string,
};

type MapProps = {
  lon: number,
  lat: number,
};

const InsetMapView = React.memo<MapProps>(({ lon, lat }: MapProps) => {
  const { styleURL, styleType } = useMapStyle();

  return styleURL === undefined || styleType === "loading" ? (
    <View style={styles.map}>
      <Loading />
    </View>
  ) : (
    <MapboxGL.MapView
      style={styles.map}
      zoomEnabled={false}
      logoEnabled={false}
      scrollEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      compassEnabled={false}
      styleURL={styleURL}
    >
      <MapboxGL.Camera
        centerCoordinate={[lon, lat]}
        zoomLevel={styleType === "fallback" ? 5 : 12}
        animationMode="moveTo"
      />
      {styleType === "fallback" ? <OfflineMapLayers /> : null}
    </MapboxGL.MapView>
  );
});

const Button = ({ onPress, color, iconName, title }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
    <View style={styles.button}>
      <MaterialIcons
        size={30}
        name={iconName}
        color={DARK_GREY}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

type ODVProps = {|
  observation: Observation,
  preset?: PresetWithFields,
  onPressPhoto: (photoIndex: number) => any,
  onPressDelete: () => any,
|};

const ObservationView = ({
  observation,
  preset,
  onPressPhoto,
  onPressDelete,
}: ODVProps) => {
  const intl = useIntl();
  const coordinateFormat = useSettingsValue("coordinateFormat");
  const { formatMessage: t } = intl;
  const deviceId = useDeviceId();
  const isMine = deviceId === observation.value.deviceId;
  const { lat, lon, attachments } = observation.value;
  // Currently only show photo attachments
  const photos = filterPhotosFromAttachments(attachments);

  const fields = (preset && preset.fields) || [];
  const icon = (preset && preset.icon) || undefined;

  const handleShare = () => {
    const { value } = observation;
    const msg = renderToString(
      <ShareMessage observation={observation} preset={preset} />,
      { intl }
    );
    const subject = renderToString(
      <ShareSubject observation={observation} preset={preset} />,
      { intl }
    );

    if (value.attachments && value.attachments.length) {
      const urls = value.attachments.map(a =>
        api.getMediaFileUri(a.id, "preview")
      );
      const options = {
        urls: urls,
        message: msg,
        subject: subject,
        failOnCancel: false,
      };
      ShareMedia.open(options);
    } else Share.share({ message: msg });
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
    >
      <>
        {/* check lat and lon are not null or undefined */}
        {lat != null && lon != null && (
          <View>
            <Image style={styles.mapIcon} source={mapIcon} />
            <View style={styles.coords}>
              <View style={styles.coordsPointer} />
              <Text style={styles.positionText}>
                <FormattedCoords
                  format={coordinateFormat}
                  lon={lon}
                  lat={lat}
                />
              </Text>
            </View>
            <InsetMapView lat={lat} lon={lon} />
          </View>
        )}
        <View>
          <Text style={styles.time}>
            <FormattedObservationDate
              observation={observation}
              variant="long"
            />
          </Text>
        </View>
        <View style={[styles.section, { flex: 1 }]}>
          <View style={styles.categoryIconContainer}>
            <CategoryCircleIcon iconId={icon} size="medium" />
            <Text style={styles.categoryLabel} numberOfLines={1}>
              <FormattedPresetName preset={preset} />
            </Text>
          </View>
          {observation.value.tags.notes &&
          observation.value.tags.notes.trim() ? (
            <View style={{ paddingTop: 15 }}>
              <Text style={styles.textNotes}>
                {observation.value.tags.notes}
              </Text>
            </View>
          ) : null}
          {!!photos.length && (
            <ThumbnailScrollView
              photos={
                // $FlowFixMe
                photos
              }
              onPressPhoto={onPressPhoto}
            />
          )}
        </View>
        {fields && fields.length > 0 && (
          <View>
            {fields.map((field, idx) => {
              const value = getProp(observation.value.tags, field.key);
              return (
                <View
                  key={idx}
                  style={[styles.section, styles.optionalSection]}
                >
                  <Text style={styles.fieldTitle}>
                    <FormattedFieldProp field={field} propName="label" />
                  </Text>
                  <Text
                    style={[
                      styles.fieldAnswer,
                      { color: value === undefined ? MEDIUM_GREY : DARK_GREY },
                    ]}
                  >
                    <FormattedFieldValue value={value} field={field} />
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        <View style={styles.divider}></View>
        <View style={styles.buttonContainer}>
          <Button
            iconName="share"
            title={t(m.share)}
            color="#3366FF"
            onPress={handleShare}
          />
          {isMine && (
            <Button
              iconName="delete"
              title={t(m.delete)}
              color={RED}
              onPress={onPressDelete}
            />
          )}
        </View>
      </>
    </ScrollView>
  );
};

export default ObservationView;

const MAP_HEIGHT = 175;
const ICON_OFFSET = { x: 22, y: 21 };

const styles = StyleSheet.create({
  categoryIconContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  categoryLabel: {
    color: BLACK,
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  root: {
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: "column",
  },
  scrollContent: { minHeight: "100%" },
  map: {
    height: MAP_HEIGHT,
  },
  mapIcon: {
    position: "absolute",
    zIndex: 11,
    width: 44,
    height: 75,
    left: Dimensions.get("screen").width / 2 - ICON_OFFSET.x,
    bottom: MAP_HEIGHT / 2 - ICON_OFFSET.y,
  },
  coords: {
    zIndex: 10,
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    flexWrap: "wrap",
    borderRadius: 15,
    bottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: WHITE,
  },
  coordsPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderBottomWidth: 10,
    borderBottomColor: WHITE,
    top: -10,
  },
  divider: {
    backgroundColor: LIGHT_GREY,
    paddingVertical: 15,
  },
  positionText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: "700",
  },
  section: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 15,
  },
  optionalSection: {
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 1,
  },
  textNotes: {
    fontSize: 22,
    color: DARK_GREY,
    fontWeight: "100",
    marginLeft: 10,
  },
  time: {
    color: BLACK,
    backgroundColor: LIGHT_GREY,
    fontSize: 14,
    paddingVertical: 10,
    textAlign: "center",
  },
  fieldAnswer: {
    fontSize: 20,
    fontWeight: "100",
  },
  fieldTitle: {
    color: BLACK,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
  },
  buttonIcon: {},
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
