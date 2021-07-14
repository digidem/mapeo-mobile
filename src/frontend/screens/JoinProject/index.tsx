// @ts-check

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../sharedComponents/Button";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { useNavigation } from "react-navigation-hooks";
import { NavigationProp } from "../../types";

export const JoinProjectScreen = () => {
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapeo</Text>
      <Button
        style={{ margin: 15 }}
        onPress={() => {
          navigate("settings");
        }}
        children="Join a Project"
      />
      <Button
        style={{ margin: 15 }}
        children="Create a Project"
        onPress={() => {
          return;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    margin: 30,
  },
  container: {
    justifyContent: "center",
    flex: 1,
  },
});
