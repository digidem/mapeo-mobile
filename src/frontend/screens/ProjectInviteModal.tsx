import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages } from "react-intl";
import { BottomSheetModal, TouchableHighlight } from "@gorhom/bottom-sheet";

import ProjectInviteContext from "../context/ProjectInviteContext";
import { LIGHT_BLUE, MAPEO_BLUE, WHITE } from "../lib/styles";
import BottomSheet from "../sharedComponents/BottomSheet";
import Button from "../sharedComponents/Button";
import Text from "../sharedComponents/Text";
import { DoneIcon } from "../sharedComponents/icons";
import Circle from "../sharedComponents/icons/Circle";

const m = defineMessages({
  title: {
    id: "screens.ProjectInviteModal.title",
    defaultMessage: "Join {projectName}",
  },
  inviteMessage: {
    id: "screens.ProjectInviteModal.inviteMessage",
    defaultMessage: "You've been invited to join\n {projectName} as a {role}",
  },
  declineInvite: {
    id: "screens.ProjectInviteModal.declineInvite",
    defaultMessage: "Decline Invite",
  },
  joinAndSync: {
    id: "screens.ProjectInviteModal.joinAndSync",
    defaultMessage: "Join And Sync",
  },
});

const ProjectInviteModal: NavigationStackScreenComponent = ({ navigation }) => {
  const sheetRef = React.useRef<BottomSheetModal>(null);
  const { invite, removeInvite } = React.useContext(ProjectInviteContext);

  const clearInvite = () => {
    if (invite) {
      removeInvite(invite.project.id);
    }
  };

  const acceptInvite = () => {
    Alert.alert(
      "Work in progress",
      "This feature has not been implemented yet",
      [
        {
          text: "Ok",
          onPress: () => clearInvite(),
        },
      ]
    );
  };

  const onDismiss = () => {
    clearInvite();
    navigation.goBack();
  };

  React.useEffect(() => {
    if (sheetRef.current) {
      if (invite) {
        sheetRef.current.present();
      } else {
        sheetRef.current.dismiss();
      }
    }
  }, [invite]);

  return (
    <BottomSheet
      ref={sheetRef}
      onDismiss={onDismiss}
      // We intentionally don't want to dismiss this modal with a back press
      onHardwareBackPress={() => {}}
    >
      {invite && (
        <View style={styles.contentContainer}>
          <View style={styles.centeredContent}>
            <Circle radius={32} style={styles.checkmarkCircle}>
              <DoneIcon color={WHITE} size={40} />
            </Circle>
            <Text style={[styles.title, styles.bold]}>
              <FormattedMessage
                {...m.title}
                values={{ projectName: invite.project.name }}
              />
            </Text>
            <Text style={styles.description}>
              <FormattedMessage
                {...m.inviteMessage}
                values={{
                  projectName: (
                    <Text style={styles.bold}>{invite.project.name}</Text>
                  ),
                  role: <Text style={styles.bold}>{invite.role}</Text>,
                }}
              />
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              TouchableComponent={props => (
                <TouchableHighlight {...props} underlayColor={WHITE} />
              )}
              onPress={clearInvite}
              variant="outlined"
            >
              <Text
                style={[styles.buttonText, styles.bold, { color: MAPEO_BLUE }]}
              >
                <FormattedMessage {...m.declineInvite} />
              </Text>
            </Button>
            <View style={styles.spacer} />
            <Button
              TouchableComponent={props => (
                <TouchableHighlight {...props} underlayColor={LIGHT_BLUE} />
              )}
              onPress={acceptInvite}
            >
              <Text style={[styles.buttonText, styles.bold, { color: WHITE }]}>
                <FormattedMessage {...m.joinAndSync} />
              </Text>
            </Button>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

ProjectInviteModal.navigationOptions = () => ({
  cardStyle: { backgroundColor: "transparent" },
  animationEnabled: false,
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  centeredContent: {
    alignItems: "center",
    paddingVertical: 12,
  },
  checkmarkCircle: {
    backgroundColor: MAPEO_BLUE,
    elevation: 0,
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: 24,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 16,
  },
  spacer: { width: 12 },
  bold: { fontWeight: "700" },
});

export default ProjectInviteModal;
