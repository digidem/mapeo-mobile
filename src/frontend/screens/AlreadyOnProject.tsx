import React from "react";
import { useContext } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Image, View, Text, StyleSheet } from "react-native";
import ConfigContext from "../context/ConfigContext";
import Button from "../sharedComponents/Button";
import { NativeRootNavigationProps } from "../sharedTypes";

const m = defineMessages({
  title: {
    id: "screens.AlreadyOnProject.title",
    defaultMessage: "You are already on a project",
    description:
      "Title of screen letting user know that they are already part of a project.",
  },
  currentProjectWarn: {
    id: "screens.AlreadyOnProject.currentProjectWarn",
    defaultMessage: "You are on {projectName}",
    description: "Informs user of the name of current project",
  },
  leaveInstructions: {
    id: "screens.AlreadyOnProject.leaveInstructions",
    defaultMessage: "To join a new project you must leave your current one.",
    description:
      "Informs user that they must leave their current project before they can join the new project",
  },
  leaveButton: {
    id: "screens.AlreadyOnProject.leaveButton",
    defaultMessage: "Leave Current Project",
    description: "Button to start leave project flow.",
  },
  goBack: {
    id: "screens.AlreadyOnProject.goBack",
    defaultMessage: "Go Back",
    description: "Button to Go Back leaving project",
  },
});

export const AlreadyOnProj = ({
  navigation,
}: NativeRootNavigationProps<"AlreadyOnProj">) => {
  const [config] = useContext(ConfigContext);
  const { formatMessage: t } = useIntl();

  const name = config.metadata.name;

  return (
    <View style={styles.screenContainer}>
      <Image
        style={{ margin: 15 }}
        source={require("../images/leaveWarning/leaveWarning.png")}
      />

      <Text style={[styles.text, { fontSize: 35, fontWeight: "bold" }]}>
        <FormattedMessage {...m.title} />
      </Text>

      {!!name && (
        <Text style={[styles.text]}>
          <FormattedMessage
            {...m.currentProjectWarn}
            values={{ projectName: name }}
          />
        </Text>
      )}

      <Text style={[styles.text]}>
        <FormattedMessage {...m.leaveInstructions} />
      </Text>

      <Button
        style={[styles.buttons, { backgroundColor: "#FF0000", marginTop: 30 }]}
        onPress={() => {
          navigation.navigate("LeaveProjectScreen");
        }}
      >
        {t(m.leaveButton)}
      </Button>

      <Button
        style={[styles.buttons]}
        variant="outlined"
        onPress={() => {
          navigation.goBack();
        }}
      >
        {t(m.goBack)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    padding: 50,
  },
  text: {
    margin: 10,
    fontSize: 16,
    textAlign: "center",
  },
  buttons: {
    margin: 10,
    minWidth: 280,
  },
});
