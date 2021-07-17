import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Button from "../../sharedComponents/Button";
import { useNavigation } from "react-navigation-hooks";
import { defineMessages, FormattedMessage } from "react-intl";
import { HeaderTitle } from "react-navigation-stack";

const m = defineMessages({
  joinProject: {
    id: "screens.JoinProjectSplash.joinProject",
    defaultMessage: "Join a Project",
  },
  createProject: {
    id: "screens.JoinProjectSplash.createProject",
    defaultMessage: "Create a Project",
  },
});

export const JoinProjectScreen = () => {
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../../images/icon_mapeo_pin.png")} />
      </View>

      <Text style={styles.title}>Mapeo</Text>
      <Button
        style={styles.button}
        onPress={() => {
          navigate("settings");
        }}
      >
        <Text style={styles.buttonText}>
          <FormattedMessage {...m.joinProject} />
        </Text>
      </Button>
      <Button
        style={styles.button}
        onPress={() => {
          navigate("settings");
        }}
      >
        <Text style={styles.buttonText}>
          <FormattedMessage {...m.createProject} />
        </Text>
      </Button>
    </View>
  );
};

//TODO research typesafe option
JoinProjectScreen.navigationOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#ffffff",
  },
  headerTitle: () => <HeaderTitle style={{ color: "white" }}>{""}</HeaderTitle>,
};

const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  container: {
    justifyContent: "center",
    flex: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 15,
    fontSize: 15,
  },
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
