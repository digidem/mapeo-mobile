import * as React from "react";
import { StyleSheet, View } from "react-native";

import { MAPEO_BLUE, WHITE } from "../../lib/styles";
import MapThumbnail from "../../sharedComponents/MapThumbnail";
import Text from "../../sharedComponents/Text";
import { TouchableHighlight } from "../../sharedComponents/Touchables";

interface Props {
  onPress: () => void;
  selected: boolean;
  styleUrl: string;
  title: string | null;
}

export const MapPreviewCard = ({
  onPress,
  selected,
  styleUrl,
  title,
}: Props) => (
  <View style={styles.container}>
    <TouchableHighlight
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.button, { borderColor: selected ? MAPEO_BLUE : WHITE }]}
    >
      <MapThumbnail styleUrl={styleUrl} style={styles.thumbnail} />
    </TouchableHighlight>
    {title && (
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  button: {
    marginBottom: 10,
    borderWidth: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: {
    height: 80,
    width: 80,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    maxWidth: 80,
  },
});
