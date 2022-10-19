import * as React from "react";

import { ScrollView } from "react-native-gesture-handler";
import { FormattedMessage, defineMessages } from "react-intl";

import { List, ListItem, ListItemText } from "../../sharedComponents/List";
import { NativeNavigationComponent } from "../../sharedTypes";
import { SecurityContext } from "../../context/SecurityContext";
import { MEDIUM_GREY, RED } from "../../lib/styles";
import { Text } from "react-native";

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
  obscurePasscodeHeader: {
    id: "screens.Security.obscurePasscodeHeader",
    defaultMessage: "Kill Passcode",
  },
  obscurePassDescriptonPassNotSet: {
    id: "screens.Security.obscurePassDescriptonPassNotSet",
    defaultMessage: "To use, enable App Passcode",
  },
  obscurePassDescriptonPassSet: {
    id: "screens.Security.obscurePassDescriptonPassSet",
    defaultMessage: "Protect your device against seizure",
  },
});

export const Security: NativeNavigationComponent<"Security"> = ({
  navigation,
}) => {
  const { authValuesSet, authState } = React.useContext(SecurityContext);
  const [highlight, setHighlight] = React.useState(false);

  React.useEffect(() => {
    if (authState === "obscured") {
      navigation.navigate("Settings");
    }
  }, [navigation, authState]);

  const [passCodeDes, obscurePassCodeDes] = React.useMemo(
    () =>
      authValuesSet.passcodeSet
        ? [m.passDesriptionPassSet, m.obscurePassDescriptonPassSet]
        : [m.passDesriptionPassNotSet, m.obscurePassDescriptonPassNotSet],
    [authValuesSet.passcodeSet]
  );

  function highlightError() {
    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, 2000);
  }

  return (
    <ScrollView>
      <List>
        <ListItem
          button={true}
          onPress={() => navigation.navigate("AppPasscode")}
        >
          <ListItemText
            primary={<FormattedMessage {...m.passcodeHeader} />}
            secondary={<FormattedMessage {...passCodeDes} />}
          />
        </ListItem>

        <ListItem
          onPress={() => {
            if (!authValuesSet.passcodeSet) {
              highlightError();
              return;
            }
            navigation.navigate("ObscurePasscode");
          }}
        >
          <ListItemText
            primary={<FormattedMessage {...m.obscurePasscodeHeader} />}
            secondary={
              <Text style={{ color: highlight ? RED : MEDIUM_GREY }}>
                <FormattedMessage {...obscurePassCodeDes} />
              </Text>
            }
          />
        </ListItem>
      </List>
    </ScrollView>
  );
};

Security.navTitle = m.title;
