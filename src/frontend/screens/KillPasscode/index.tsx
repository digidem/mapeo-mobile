import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { Switch, View } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { KILL_PASSCODE } from "../../constants";
import { ListDivider } from "../../sharedComponents/List";
import Text from "../../sharedComponents/Text";

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
    defaultMessage: "Enter the code aboce to hide sensitive data in Mapeo",
  },
});

export const KillPasscode: NavigationStackScreenComponent = () => {
  return (
    <View>
      <Text>
        <FormattedMessage {...m.title} />
      </Text>
      <Text>
        <FormattedMessage {...m.body} />
      </Text>

      <View>
        <FormattedMessage {...m.toggleMessage} />
        <Switch />
      </View>

      <View>
        <Text>{KILL_PASSCODE}</Text>
        <Text>
          <FormattedMessage {...m.instructions} />
        </Text>
      </View>
    </View>
  );
};
