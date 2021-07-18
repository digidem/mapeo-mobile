import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bar } from "react-native-progress";
import { defineMessage, defineMessages, FormattedMessage } from "react-intl";
import ConfigContext from "../../context/ConfigContext";

const m = defineMessages({
  leaveProjectTitle: {
    id: "screens.LeaveProject.LeaveProjectProgress.leaveProjectTitle",
    defaultMessage: "Leave Project{projectName}?",
  },
  progressMessage: {
    id: "screens.LeaveProject.LeaveProjectProgress.progressMessage",
    defaultMessage: "Deleting Observations",
  },
});

export const LeaveProjectProgress = () => {
  const [config] = useContext(ConfigContext);

  const name = useMemo(() => {
    if (!!config.metadata.name) {
      return "";
    } else {
      return " " + config.metadata.name;
    }
  }, [config]);

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>
        <FormattedMessage
          {...m.leaveProjectTitle}
          values={{ projectName: name }}
        />
      </Text>

      <Text style={styles.progressMessage}>
        <FormattedMessage {...m.progressMessage} />
      </Text>

      <Bar
        style={[{ marginTop: 30 }]}
        progress={0.5}
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
