import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, Switch, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { KILL_PASSCODE } from "../constants";
import { SecurityContext } from "../context/SecurityContext";
import { LIGHT_GREY } from "../lib/styles";
import HeaderTitle from "../sharedComponents/HeaderTitle";
import IconButton from "../sharedComponents/IconButton";
import { BackIcon } from "../sharedComponents/icons";
import Text from "../sharedComponents/Text";

const m = defineMessages({
  title: {
    id: "screens.KillPasscode.title",
    defaultMessage: "Kill Passcode",
  },
  body: {
    id: "screens.KillPasscode.body",
    defaultMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
  },
  toggleMessage: {
    id: "screens.KillPasscode.toggleMessage",
    defaultMessage: "Use Kill Passcode",
  },
  instructions: {
    id: "screens.KillPasscode.instructions",
    defaultMessage: "Enter the code above to hide sensitive data in Mapeo",
  },
});

export const KillPasscode: NavigationStackScreenComponent = () => {
  const {
    passcode,
    killStateActive,
    setKillStateActive,
    killState,
  } = React.useContext(SecurityContext);

  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (!passcode || killState) navigate("Security");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <FormattedMessage {...m.title} />
      </Text>
      <Text>
        <FormattedMessage {...m.body} />
      </Text>

      <View style={styles.switch}>
        <Text>
          <FormattedMessage {...m.toggleMessage} />
        </Text>
        <Switch
          onChange={() => {
            setKillStateActive(!killStateActive);
          }}
          value={killStateActive}
        />
      </View>

      {killStateActive && (
        <View style={styles.passbox}>
          <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 20 }}>
            {KILL_PASSCODE}
          </Text>
          <Text style={{ fontSize: 16 }}>
            <FormattedMessage {...m.instructions} />
          </Text>
        </View>
      )}
    </View>
  );
};

KillPasscode.navigationOptions = () => ({
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
  headerLeft: ({ onPress }) =>
    onPress && (
      <IconButton onPress={onPress}>
        <BackIcon />
      </IconButton>
    ),
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  passbox: {
    borderRadius: 10,
    backgroundColor: LIGHT_GREY,
    marginTop: 30,
    padding: 20,
    fontSize: 20,
  },
  switch: {
    alignSelf: "flex-start",
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 2,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 2,
    paddingVertical: 20,
    marginTop: 30,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
