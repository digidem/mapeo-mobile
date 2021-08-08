import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Text, StyleSheet, Image } from "react-native";
import Button from "../../sharedComponents/Button";
import {
  NavigationStackOptions,
  NavigationStackScreenComponent,
} from "react-navigation-stack";
import { useNavigation } from "react-navigation-hooks";
import { ILeaveSharedProp } from ".";

const m = defineMessages({
  projectDeleted: {
    id: "screens.LeaveProject.LeaveProjectCompleted.projectDeleted",
    defaultMessage: "Complete!",
  },
  observationsDeleted: {
    id: "screens.LeaveProject.LeaveProjectCompleted.observationsDeleted",
    defaultMessage: "Observations Deleted",
  },
  goHome: {
    id: "screens.LeaveProject.LeaveProjectCompleted.goHome",
    defaultMessage: "Go Home",
  },
});

const navOption: NavigationStackOptions = {
  headerShown: false,
};

export const LeaveProjectCompleted = ({
  screenStateHook,
}: ILeaveSharedProp) => {
  const [screen, setScreen] = screenStateHook;

  const nav = useNavigation();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topContainer}>
        <Image source={require("../../images/completed/checkComplete.png")} />
        <Text style={styles.title}>
          <FormattedMessage {...m.projectDeleted} />
        </Text>
        <Text>
          <FormattedMessage {...m.observationsDeleted} />
        </Text>
      </View>
      <View>
        <Button
          onPress={() => {
            nav.navigate("Home");
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "400", color: "#ffffff" }}>
            <FormattedMessage {...m.goHome} />
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 25,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    margin: 30,
    fontWeight: "bold",
  },
  topContainer: {
    alignItems: "center",
    marginTop: 50,
  },
});
