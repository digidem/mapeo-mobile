import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bar } from "react-native-progress";
import { defineMessage, defineMessages, FormattedMessage } from "react-intl";
import ConfigContext from "../../context/ConfigContext";
import {
  NavigationStackOptions,
  NavigationStackScreenComponent,
} from "react-navigation-stack";
import { useState } from "react";
import { Value } from "react-native-reanimated";
import { useNavigation } from "react-navigation-hooks";

const m = defineMessages({
  leaveProjectTitle: {
    id: "screens.LeaveProject.LeaveProjectProgress.leaveProjectTitle",
    defaultMessage: "Leaving Project {projectName}",
  },
  progressMessage: {
    id: "screens.LeaveProject.LeaveProjectProgress.progressMessage",
    defaultMessage: "Deleting Observations",
  },
});

const navOptions: NavigationStackOptions = {
  headerShown: false,
};

export const LeaveProjectProgress: NavigationStackScreenComponent = () => {
  const [config] = useContext(ConfigContext);
  const { navigate } = useNavigation();
  //To do => When Delete API has been created
  const [progress, setProgress] = useState(0);

  setTimeout(() => {
    navigate("LeaveProjectCompleted");
  }, 3000);

  const name = config.metadata.name || "";

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>
        <FormattedMessage
          {...m.leaveProjectTitle}
          values={{ projectName: name }}
        />
      </Text>

      <Text style={styles.progressMessage}>
        <FormattedMessage
          {...m.progressMessage}
          values={{ projectName: name }}
        />
      </Text>

      <Bar style={[{ marginTop: 30 }]} {...progress} height={20} width={null} />
    </View>
  );
};

LeaveProjectProgress.navigationOptions = navOptions;

const styles = StyleSheet.create({
  screenContainer: {
    padding: 25,
    flex: 1,
  },
  title: {
    fontSize: 32,
    margin: 10,
    textAlign: "center",
  },
  progressMessage: {
    margin: 10,
    textAlign: "center",
    fontSize: 16,
  },
});
