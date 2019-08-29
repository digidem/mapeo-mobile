// @flow
import React, { useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";

import { AlertIcon } from "../../sharedComponents/icons";

type Props = {
  uri?: string,
  variant: "photo" | "loading" | "error"
};

const PhotoView = ({ onClose, uri, variant = "photo" }: Props) => {
  const [error, setError] = useState();
  return (
    <View style={styles.container}>
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
          resizeMode="contain"
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
    alignItems: "center"
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black"
  }
});
