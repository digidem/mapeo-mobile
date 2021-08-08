import React, { useContext, useState } from "react";
import { defineMessage, FormattedMessage } from "react-intl";
import { View, Text, StyleSheet, Image } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import ConfigContext from "../../context/ConfigContext";
import Button from "../../sharedComponents/Button";
import { useNavigation } from "react-navigation-hooks";
import {
  NavigationStackOptions,
  NavigationStackScreenComponent,
} from "react-navigation-stack";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import { ILeaveSharedProp } from ".";

const m = defineMessage({
  leaveProjectTitle: {
    id: "screens.LeaveProject.LeaveProject.leaveProjectTitle",
    defaultMessage: "Leave Project{projectName}?",
  },
  headerTitle: {
    id: "screens.LeaveProject.LeaveProject.headerTitle",
    defaultMessage: "Leave Project",
  },
  willDelete: {
    id: "screens.LeaveProject.LeaveProject.willDelete",
    defaultMessage:
      "This will delete {numOfObservations} observations and {numOfPics} Pictures",
  },
  agreeToDelete: {
    id: "screens.LeaveProject.LeaveProject.agreeToDelete",
    defaultMessage: "I understand I will be deleting all data from my device.",
  },
  leaveButton: {
    id: "screens.LeaveProject.LeaveProject.leaveButton",
    defaultMessage: "Leave Project",
  },
  cancel: {
    id: "screens.LeaveProject.LeaveProject.cancel",
    defaultMessage: "Cancel",
  },
  confirmDelete: {
    id: "screens.LeaveProject.LeaveProject.confirmDelete",
    defaultMessage: "Please check the box to confirm",
  },
  syncWarning: {
    id: "screens.LeaveProject.LeaveProject.syncWarning",
    defaultMessage:
      "Sync with a team member so you don't loose all your observations.",
  },
});

const navOptions: NavigationStackOptions = {
  headerTitle: () => (
    <HeaderTitle style={{ color: "#ffffff" }}>
      <FormattedMessage {...m.headerTitle} />
    </HeaderTitle>
  ),
};

export const LeaveProjectInitial = ({ screenStateHook }: ILeaveSharedProp) => {
  const [screen, setScreen] = screenStateHook;
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [untouched, setUntouched] = useState(true);
  const [config] = useContext(ConfigContext);

  const nav = useNavigation();

  function getObservationData() {}

  function leaveProject() {
    if (untouched) setUntouched(false);

    if (!confirmDelete) return;
    setScreen(screen + 1);
  }

  const name = config.metadata.name ? " " + config.metadata.name : "";

  return (
    <View style={styles.screenContainer}>
      <View>
        <Text style={styles.title}>
          <FormattedMessage
            {...m.leaveProjectTitle}
            values={{ projectName: name }}
          />
        </Text>

        <Text style={styles.subHeader}>
          <FormattedMessage {...m.willDelete} />
        </Text>
      </View>

      <View style={styles.warningContainer}>
        <Image
          source={require("../../images/Vector.png")}
          style={{ margin: 10 }}
        />
        <Text style={{ padding: 5, flex: 1 }}>
          <FormattedMessage {...m.syncWarning} />
        </Text>
      </View>

      <View style={styles.confirmContainer}>
        <View style={styles.checkContainer}>
          <CheckBox
            value={confirmDelete}
            onValueChange={() =>
              setConfirmDelete(confirmDelete => !confirmDelete)
            }
          />
          <Text>
            <FormattedMessage {...m.agreeToDelete} />
          </Text>
        </View>
        {!untouched && !confirmDelete && (
          <Text style={styles.confirmMessage}>
            <FormattedMessage {...m.confirmDelete} />
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={leaveProject}
          style={{ backgroundColor: "#FF0000", margin: 15 }}
        >
          <Text style={[styles.buttonText, { color: "#ffffff" }]}>
            <FormattedMessage {...m.leaveButton} />
          </Text>
        </Button>
        <Button
          onPress={() => {
            nav.goBack();
          }}
          style={{ margin: 15 }}
          variant="outlined"
        >
          <Text style={[styles.buttonText, { color: "#0066FF" }]}>
            <FormattedMessage {...m.cancel} />
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 25,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    margin: 15,
  },
  leaveButton: {
    color: "#ff0000",
  },
  checkContainer: {
    flexDirection: "row",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmContainer: {
    padding: 25,
  },
  confirmMessage: {
    color: "#FF0000",
    margin: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  warningContainer: {
    backgroundColor: "#F6F6F6",
    padding: 25,
    borderRadius: 15,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
