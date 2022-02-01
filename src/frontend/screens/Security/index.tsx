import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages } from "react-intl";

import {
  List,
  ListItem,
  ListItemText,
  ListDivider,
} from "../../sharedComponents/List";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon, SaveIcon } from "../../sharedComponents/icons";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import { useNavigation } from "react-navigation-hooks";
import SettingsContext from "../../context/SettingsContext";
import { SecurityContext } from "../../context/SecurityContext";

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
  deviceBackup: {
    id: "screens.Security.deviceBackup",
    defaultMessage: "Device Backup",
  },
  paperKey: {
    id: "screens.Security.paperKey",
    defaultMessage: "Paper Key",
  },
  paperKeyDes: {
    id: "screens.Security.paperKeyDes",
    defaultMessage: "Reinstate your account if this device is lost",
  },
});

export const Security: NavigationStackScreenComponent = () => {
  const [{ experiments }] = React.useContext(SettingsContext);
  const { passcode } = React.useContext(SecurityContext);
  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (!experiments.appPasscode) navigate("Settings");
  }, [experiments]);

  const [passCodeDes, killPassCodeDes] = React.useMemo(
    () =>
      !!passcode
        ? [m.passDesriptionPassSet, m.killPassDescriptonPassSet]
        : [m.passDesriptionPassNotSet, m.killPassDescriptonPassNotSet],
    [passcode]
  );

  return (
    <List>
      <ListItem button={false} style={{ marginVertical: 10 }}>
        <ListItemText
          style={{ textTransform: "uppercase" }}
          primary={<FormattedMessage {...m.securitySubheader} />}
        />
      </ListItem>

      <ListItem button={true} onPress={() => navigate("AppPasscode")}>
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

      <ListDivider style={styles.divder} />

      <ListItem button={false}>
        <ListItemText
          style={{ textTransform: "uppercase" }}
          primary={<FormattedMessage {...m.deviceBackup} />}
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary={<FormattedMessage {...m.paperKey} />}
          secondary={<FormattedMessage {...m.paperKeyDes} />}
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

const styles = StyleSheet.create({
  divder: {
    marginVertical: 20,
  },
});
