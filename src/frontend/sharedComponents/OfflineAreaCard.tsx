import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { StyleSheet, View } from "react-native";
import { LIGHT_GREY } from "../lib/styles";
import Text from "./Text";

const m = defineMessages({
  lvlDetail: {
    id: "sharedComponent.OfflineAreaCard.lvlDetail",
    defaultMessage: "Level of Detail",
  },
  zoomLevel: {
    id: "sharedComponent.OfflineAreaCard.zoomLevel",
    defaultMessage: "Zoom Level",
  },
  lvlDetailGlobal: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailGlobal",
    defaultMessage: "Global",
    description: "Level of detail seen on map - farthest zoom level",
  },
  lvlDetailSubcontinent: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailSubcontinent",
    defaultMessage: "Subcontinent",
    description: "Level of detail seen on map - second farthest zoom level",
  },
  lvlDetailLargeCountry: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailLargeCountry",
    defaultMessage: "Large Country",
    description: "Level of detail seen on map - can see large countries",
  },
  lvlDetailSmallCountry: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailSmallCountry",
    defaultMessage: "Small Country",
    description: "Level of detail seen on map - can see smaller countries",
  },
  lvlDetailLargeMetro: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailLargeMetro",
    defaultMessage: "Large Metropolitan Area",
    description:
      "Level of detail seen on map - can see details of large metropolitan areas",
  },
  lvlDetailCity: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailCity",
    defaultMessage: "City",
    description: "Level of detail seen on map - can see most Cities on Map",
  },
  lvlDetailTown: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailTown",
    defaultMessage: "Town",
    description: "Level of detail seen on map - can see most towns on map",
  },
  lvlDetailVillage: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailVillage",
    defaultMessage: "Village",
    description: "Level of detail seen on map - can see villages on map",
  },
  lvlDetailSmallRoad: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailSmallRoad",
    defaultMessage: "Small Road",
    description: "Level of detail seen on map - can see small roads on map",
  },
  lvlDetailStreet: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailStreet",
    defaultMessage: "Street",
    description: "Level of detail seen on map - can see most streets on map",
  },
  lvlDetailStreetBlock: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailStreetBlock",
    defaultMessage: "Street Block",
    description:
      "Level of detail seen on map - can see details of street blocks on map",
  },
  lvlDetailAddress: {
    id: "sharedComponent.OfflineAreaCard.lvlDetailAddress",
    defaultMessage: "Address",
    description: "Level of detail seen on map - can see addresses on map",
  },
  lvlDetailStreetIntersection: {
    id: "sharedComponent.OfflineAreaCard.StreetIntersection",
    defaultMessage: "Street Intersection",
    description:
      "Level of detail seen on map - can see street intersections on map",
  },
});

interface OfflineAreaCardProps {
  title: string;
  zoomLevel: number;
  position: number;
}

export const OfflineAreaCard = ({
  title,
  zoomLevel,
  position,
}: OfflineAreaCardProps) => {
  const { formatMessage: t } = useIntl();

  const lvlOfDetail = React.useMemo(() => {
    switch (true) {
      case zoomLevel <= 2:
        return m.lvlDetailGlobal;
      case zoomLevel <= 4:
        return m.lvlDetailSubcontinent;
      case zoomLevel <= 6:
        return m.lvlDetailLargeCountry;
      case zoomLevel <= 8:
        return m.lvlDetailSmallCountry;
      case zoomLevel <= 10:
        return m.lvlDetailLargeMetro;
      case zoomLevel === 11:
        return m.lvlDetailCity;
      case zoomLevel === 12:
        return m.lvlDetailTown;
      case zoomLevel <= 14:
        return m.lvlDetailVillage;
      case zoomLevel === 15:
        return m.lvlDetailSmallRoad;
      case zoomLevel === 16:
        return m.lvlDetailStreet;
      case zoomLevel === 17:
        return m.lvlDetailStreetBlock;
      case zoomLevel === 18:
        return m.lvlDetailAddress;
      case zoomLevel < 23:
        return m.lvlDetailStreetIntersection;
      default:
        return m.lvlDetailGlobal;
    }
  }, [zoomLevel]);

  return (
    <View style={[styles.container, position === 0 ? {} : { marginTop: 20 }]}>
      <Text style={[styles.text, styles.title]}>{title}</Text>
      <Text style={[styles.text]}>
        <FormattedMessage {...m.zoomLevel} />: {zoomLevel.toString()}
      </Text>

      <Text style={[styles.text]}>
        <FormattedMessage {...m.lvlDetail} />: {t(lvlOfDetail)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: LIGHT_GREY,
    borderWidth: 2,
    padding: 10,
    borderRadius: 2,
  },
  text: {
    fontSize: 16,
  },
  title: {
    fontWeight: "bold",
  },
});
