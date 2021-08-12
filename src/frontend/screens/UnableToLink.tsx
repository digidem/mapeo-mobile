import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { StyleSheet } from "react-native";
import { View, Image, Text, Share } from "react-native";
import {
  NavigationStackOptions,
  NavigationStackScreenComponent,
} from "react-navigation-stack";
import Button from "../sharedComponents/Button";
import WifiBar from "../sharedComponents/WifiBar";
import HeaderTitle from "../sharedComponents/HeaderTitle";
import { URI_PREFIX } from "../constants";
import useWifiStatus from "../hooks/useWifiStatus";
import { useNavigation } from "react-navigation-hooks";
const m = defineMessages({
  unableToLink: {
    id: "screens.UnableToLink.unableToLink",
    defaultMessage: "Unable to Link to Device",
    description:
      "Main message indicating that user is not able to link to another device which is trying to join a project",
  },
  tryAnotherMethod: {
    id: "screens.UnableToLink.tryAnotherMethod",
    defaultMessage: "Try connecting using one of the other methods below.",
    description:
      "Suggests that user tries another method for adding another device to the project.",
  },
  bannerTitle: {
    id: "screens.UnableToLink.bannerTitle",
    defaultMessage: "Add to Project",
    description: "Title describing the flow of adding user to project",
  },
  showCode: {
    id: "screens.UnableToLink.showCode",
    defaultMessage: "Show QR Code",
    description: "Button prompting user to show code for message",
  },
  shareInvite: {
    id: "screens.UnableToLink.shareInvite",
    defaultMessage: "Share Invite",
    description:
      "Button prompting user to share a link to invite user to join a project",
  },
});

const UnableToLinkScreen: NavigationStackScreenComponent = () => {
  const { ssid } = useWifiStatus();
  const { formatMessage: t } = useIntl();
  const { navigate } = useNavigation();

  // TOOD: Need to properly generate
  const verificationCode = Math.random().toString().slice(-5);

  // TODO: Decide on a URL structure for this deep link
  const shareLink = `${URI_PREFIX}main/onboarding?code=${verificationCode}`;

  async function handleShareInvite() {
    await Share.share({ message: shareLink, url: shareLink });
  }

  return (
    <View>
      <WifiBar deviceName="TO DO-GET NAME" ssid={ssid} />
      <View style={styles.screenContainer}>
        <Image
          style={{ margin: 15 }}
          source={require("../images/leaveWarning/leaveWarning.png")}
        />

        <Text style={styles.header}>
          <FormattedMessage {...m.unableToLink} />
        </Text>

        <Text style={styles.subHeader}>
          <FormattedMessage {...m.tryAnotherMethod} />
        </Text>

        <Button
          style={[styles.buttons]}
          onPress={() =>
            navigate("JoinProjectQr", {
              isAdmin: true,
            })
          }
          variant="outlined"
        >
          {t(m.showCode)}
        </Button>

        <Button
          style={[styles.buttons]}
          onPress={handleShareInvite}
          variant="outlined"
        >
          {t(m.shareInvite)}
        </Button>
      </View>
    </View>
  );
};

UnableToLinkScreen.navigationOptions = () => ({
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.bannerTitle} />
    </HeaderTitle>
  ),
});

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: "10%",
  },
  header: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "500",
    margin: 15,
  },
  subHeader: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  buttons: {
    margin: 10,
  },
});

export default UnableToLinkScreen;
