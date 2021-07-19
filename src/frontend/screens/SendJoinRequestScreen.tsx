import * as React from "react";
import { Share, StyleSheet, View } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";
import { getUniqueId } from "react-native-device-info";
import {
  NavigationStackScreenComponent,
  TransitionPresets,
} from "react-navigation-stack";

import useWifiStatus from "../hooks/useWifiStatus";
import { MEDIUM_BLUE, WHITE } from "../lib/styles";
import HeaderTitle from "../sharedComponents/HeaderTitle";
import { BackIcon } from "../sharedComponents/icons";
import Button from "../sharedComponents/Button";
import IconButton from "../sharedComponents/IconButton";
import WifiBar from "../sharedComponents/WifiBar";
import Text from "../sharedComponents/Text";

const m = defineMessages({
  title: {
    id: "screens.SendJoinRequest.title",
    defaultMessage: "Send Join Request",
  },
  verificationCode: {
    id: "screens.SendJoinRequest.verificationCode",
    defaultMessage: "Verification Code",
  },
  instructions: {
    id: "screens.SendJoinRequest.instructions",
    defaultMessage: "Share this code with the Project Coordinator",
  },
  share: {
    id: "screens.SendJoinRequest.share",
    defaultMessage: "Share",
  },
});

const SendJoinRequestScreen: NavigationStackScreenComponent = () => {
  const { ssid } = useWifiStatus();

  const deviceName = "Android " + getUniqueId().slice(0, 4).toUpperCase();

  // TOOD: Need to properly generate
  const generateVerificationCode = () => "12345";

  // TODO: Need to properly generate a deeplink
  const shareLink = "https://digital-democracy.org";

  return (
    <View style={styles.pageContainer}>
      <WifiBar deviceName={deviceName} ssid={ssid} />
      <View style={styles.container}>
        <View>
          <Text style={styles.verificationCodeTitle}>
            <FormattedMessage {...m.verificationCode} />
          </Text>
          <Text style={styles.verificationCode}>
            {generateVerificationCode()}
          </Text>
          <Text style={styles.instructions}>
            <FormattedMessage {...m.instructions} />
          </Text>
        </View>
        <Button
          onPress={() => Share.share({ message: shareLink, url: shareLink })}
        >
          <Text style={styles.shareButton}>
            <FormattedMessage {...m.share} />
          </Text>
        </Button>
      </View>
    </View>
  );
};

SendJoinRequestScreen.navigationOptions = () => ({
  ...TransitionPresets.SlideFromRightIOS,
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
  pageContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    padding: 40,
  },
  verificationCodeTitle: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
  },
  verificationCode: {
    fontWeight: "700",
    textAlign: "center",
    fontSize: 40,
    marginVertical: 24,
  },
  instructions: { textAlign: "center", fontSize: 24 },
  shareButton: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 16,
    paddingHorizontal: 40,
  },
});

export default SendJoinRequestScreen;
