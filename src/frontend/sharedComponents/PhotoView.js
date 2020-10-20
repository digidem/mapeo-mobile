// @flow
import React, { useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";

import { AlertIcon } from "./icons";
import type { ViewStyleProp } from "../types";

type Props = {
  uri?: string,
  variant?: "photo" | "loading" | "error",
  style?: ViewStyleProp,
  resizeMode?: "cover" | "contain" | "stretch" | "center",
};

const PhotoView = ({
  uri,
  variant = "photo",
  resizeMode = "contain",
  style,
}: Props) => {
  const [error, setError] = useState();
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

export default React.memo<Props>(PhotoView);

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
