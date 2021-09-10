import * as React from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

import { ViewStyleProp } from "../sharedTypes";
import { AlertIcon } from "./icons";

interface Props {
  uri?: string;
  variant?: "photo" | "loading" | "error";
  style?: ViewStyleProp;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
}

const PhotoView = ({
  uri,
  variant = "photo",
  resizeMode = "contain",
  style,
}: Props) => {
  const [error, setError] = React.useState();
  return (
    <View style={[styles.container, style]}>
      {variant === "loading" ? (
        <ActivityIndicator />
      ) : variant === "error" || error || !uri ? (
        <AlertIcon />
      ) : (
        <Image
          onError={({ nativeEvent: { error } }) => setError(error)}
          source={{ uri }}
          style={styles.image}
          resizeMethod="scale"
          resizeMode={resizeMode}
        />
      )}
    </View>
  );
};

export default React.memo(PhotoView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
});
