import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { StackActions, NavigationActions } from "react-navigation";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import QRCode from "react-native-qrcode-svg";

import { MEDIUM_BLUE, WHITE } from "../../lib/styles";
import { BackIcon } from "../../sharedComponents/icons";
import Button from "../../sharedComponents/Button";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import IconButton from "../../sharedComponents/IconButton";
import Text from "../../sharedComponents/Text";
import { WithWifiBar } from "./WithWifiBar";

const m = defineMessages({
  title: {
    id: "screens.Onboarding.JoinProjectQrScreen.title",
    defaultMessage: "Join a Project",
  },
  instructionsTitle: {
    id: "screens.Onboarding.JoinProjectQrScreen.instructionsTitle",
    defaultMessage: "Instructions",
  },
  instructionsDescription: {
    id: "screens.Onboarding.JoinProjectQrScreen.instructionsDescription",
    defaultMessage: "Show this QR code to your Project Admin",
  },
  instructionDescriptionAsAdmin: {
    id: "screens.Onboarding.JoinProjectQrScreen.instructionDescriptionAsAdmin",
    defaultMessage: "Have the Project Participant scan this invite code.",
  },
  sendJoinRequest: {
    id: "screens.Onboarding.JoinProjectQrScreen.sendJoinRequest",
    defaultMessage: "Send Join Request instead",
  },
  cancel: {
    id: "screens.Onboarding.JoinProjectQrScreen.cancel",
    defaultMessage: "Cancel",
  },
});

//Cancels the QR code screen and resets the navigation stack so the
//user CANNOT hit the back button to go back to this screen
const resetAction = StackActions.reset({
  index: 0, // <-- currect active route from actions array
  actions: [NavigationActions.navigate({ routeName: "Home" })],
});

/* 
  This screen is being used for 2 use cases:
  1. Project Joiner asking to be invited to project
  2. Project Admin adding user to project

  IsAdmin:boolean Flag is passed (through navigation) if the 
  user is in an admin
*/
export const JoinProjectQrScreen: NavigationStackScreenComponent = () => {
  const navigation = useNavigation();
  const { formatMessage: t } = useIntl();

  const isAdmin: boolean =
    JSON.stringify(navigation.getParam("isAdmin", false)) === "true";

  return (
    <WithWifiBar>
      <View style={styles.container}>
        <View>
          <View style={styles.qrCodeContainer}>
            {/* TODO: use an actual value for this */}
            <QRCode value="https://digital-democracy.org" size={250} />
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              <FormattedMessage {...m.instructionsTitle} />
            </Text>
            <Text style={styles.instructionsDescription}>
              {isAdmin ? (
                <FormattedMessage {...m.instructionDescriptionAsAdmin} />
              ) : (
                <FormattedMessage {...m.instructionsDescription} />
              )}
            </Text>
          </View>
        </View>

        {isAdmin ? (
          //Admin cancel Button
          <Button
            variant="outlined"
            onPress={() => navigation.dispatch(resetAction)}
          >
            {t(m.cancel)}
          </Button>
        ) : (
          // Project Joiner Request
          <Button
            variant="text"
            onPress={() => navigation.navigate("SendJoinRequest")}
          >
            <Text style={styles.sendJoinRequest}>
              <FormattedMessage {...m.sendJoinRequest} />
            </Text>
          </Button>
        )}
      </View>
    </WithWifiBar>
  );
};

JoinProjectQrScreen.navigationOptions = () => ({
  headerTitle: () => (
    <HeaderTitle style={{ color: WHITE }}>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
  headerLeft: ({ onPress }) =>
    onPress && (
      <IconButton onPress={onPress}>
        <BackIcon color={WHITE} />
      </IconButton>
    ),
  headerStyle: {
    backgroundColor: MEDIUM_BLUE,
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    padding: 40,
  },
  qrCodeContainer: {
    alignItems: "center",
  },
  instructionsContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionsDescription: {
    fontSize: 16,
    textAlign: "center",
  },
  joinRequestContainer: {
    alignItems: "center",
  },
  sendJoinRequest: {
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
