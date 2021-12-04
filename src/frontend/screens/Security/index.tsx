import * as React from "react";
import { View, Text } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages } from "react-intl";

import { List, ListItem, ListItemText } from "../../sharedComponents/List";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon, SaveIcon } from "../../sharedComponents/icons";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import { SecurityContext } from "./SecurityContext";

const m = defineMessages({
  title: {
    id: "screens.Security.title",
    defaultMessage: "Security",
  },
  securitySubheader: {
    id: "screens.Security.securitySubheader",
    defaultMessage: "Device Security",
  },
  passcodeHeader: {
    id: "screens.Security.passcodeHeader",
    defaultMessage: "App Passcode",
  },
  passDesriptionPassNotSet: {
    id: "screens.Security.passDesriptionPassNotSet",
    defaultMessage: "Passcode not set",
  },
  passDesriptionPassSet: {
    id: "screens.Security.passDesriptionPassSet",
    defaultMessage: "Passcode is set",
  },
  killPasscodeHeader: {
    id: "screens.Security.killPasscodeHeader",
    defaultMessage: "Kill Passcode",
  },
  killPassDescriptonPassNotSet: {
    id: "screens.Security.killPassDescriptonPassNotSet",
    defaultMessage: "To use, enable App Passcode",
  },
  killPassDescriptonPassSet: {
    id: "screens.Security.killPassDescriptonPassSet",
    defaultMessage: "Protect your device against seizure",
  },
});

export const Security: NavigationStackScreenComponent = () => {
  const { passIsSet } = React.useContext(SecurityContext);

  const [passCodeDes, killPassCodeDes] = React.useMemo(
    () =>
      passIsSet
        ? [m.passDesriptionPassSet, m.killPassDescriptonPassSet]
        : [m.passDesriptionPassNotSet, m.killPassDescriptonPassNotSet],
    [passIsSet]
  );

  return (
    <List style={{}}>
      <ListItem>
        <ListItemText primary={<FormattedMessage {...m.securitySubheader} />} />
      </ListItem>

      <ListItem
        button={true}
        onPress={() => {
          return;
        }}
      >
        <ListItemText
          primary={<FormattedMessage {...m.passcodeHeader} />}
          secondary={<FormattedMessage {...passCodeDes} />}
        />
      </ListItem>

      <ListItem
        button={true}
        onPress={() => {
          return;
        }}
      >
        <ListItemText
          primary={<FormattedMessage {...m.killPasscodeHeader} />}
          secondary={<FormattedMessage {...killPassCodeDes} />}
        />
      </ListItem>
    </List>
  );
};

Security.navigationOptions = () => ({
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
