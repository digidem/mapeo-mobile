import * as React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { FormattedMessage, defineMessages } from "react-intl";

import {
  List,
  ListItem,
  ListItemText,
  ListDivider,
} from "../../sharedComponents/List";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon } from "../../sharedComponents/icons";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import { SecurityContext } from "./SecurityContext";
import { useNavigation } from "react-navigation-hooks";
import SettingsContext from "../../context/SettingsContext";
import { devExperiments } from "../../lib/DevExperiments";

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
  const { passIsSet } = React.useContext(SecurityContext);
  const [{ experiments }] = React.useContext(SettingsContext);
  const { navigate } = useNavigation();
  const { appPasscode } = devExperiments;

  React.useEffect(() => {
    if (!appPasscode) navigate("Settings");
  }, [appPasscode]);

  const [passCodeDes, killPassCodeDes] = React.useMemo(
    () =>
      passIsSet
        ? [m.passDesriptionPassSet, m.killPassDescriptonPassSet]
        : [m.passDesriptionPassNotSet, m.killPassDescriptonPassNotSet],
    [passIsSet]
  );

  return (
    <ScrollView>
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
    </ScrollView>
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
