import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bar } from "react-native-progress";
import { defineMessages, FormattedMessage } from "react-intl";
import ConfigContext from "../../context/ConfigContext";
import { useState } from "react";
import { LeaveProjSharedProp } from ".";
import { useSetHeader } from "../../hooks/useSetHeader";

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

export const LeaveProjectProgress = ({ next }: LeaveProjSharedProp) => {
  const [config] = useContext(ConfigContext);
  useSetHeader({ headerShown: false });

  //To do => When Delete API has been created
  const [progress, setProgress] = useState(0);
  setTimeout(() => {
    next();
  }, 2000);

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

      <Bar
        style={[{ marginTop: 30 }]}
        progress={progress}
        height={20}
        width={null}
      />
    </View>
  );
};

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
