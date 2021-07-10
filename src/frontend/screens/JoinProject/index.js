// @ts-check

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../sharedComponents/Button";
import { NavigationProp } from "react-navigation";
import { useNavigation } from "react-navigation-hooks";

/**
 *
 * @returns {React.ReactElement}
 */
export const JoinProjectScreen = () => {
  function joinNewProject() {}

  function createProject() {
    navigation.navigate("Settings");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapeo</Text>
      <Button
        style={{ margin: 15 }}
        onPress={joinNewProject}
        children="Join a Project"
      />
      <Button
        style={{ margin: 15 }}
        children="Create a Project"
        onPress={createProject}
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
