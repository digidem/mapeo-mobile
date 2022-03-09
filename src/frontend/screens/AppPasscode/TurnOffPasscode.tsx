import * as React from "react";
import { StyleSheet } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { useNavigation } from "react-navigation-hooks";
import { defineMessages, FormattedMessage } from "react-intl";

import { SecurityContext } from "../../context/SecurityContext";

import {
  List,
  ListDivider,
  ListItem,
  ListItemText,
} from "../../sharedComponents/List";
import { MEDIUM_GREY } from "../../lib/styles";
import { PasscodeScreens } from ".";

const m = defineMessages({
  usePasscode: {
    id: "screens.AppPasscode.TurnOffPasscode.usePasscode",
    defaultMessage: "Use App Passcode",
  },
  changePasscode: {
    id: "screens.AppPasscode.TurnOffPasscode.changePasscode",
    defaultMessage: "Change App Passcode",
  },
});

interface TurnOffPasscodeProps {
  setScreenState: (screen: PasscodeScreens) => void;
}

export const TurnOffPasscode = ({ setScreenState }: TurnOffPasscodeProps) => {
  const [{ passcode }, setAuthState] = React.useContext(SecurityContext);
  const { navigate } = useNavigation();

  //This will make sure that user can only see the screen when a password is set
  React.useEffect(() => {
    if (!passcode) navigate("Security");
  }, []);

  const passcodeSet = React.useMemo(() => passcode != undefined, [passcode]);

  function unsetAppPasscode() {
    if (!!passcode) setAuthState({ type: "setPasscode", newPasscode: null });

    if (!passcode) setScreenState("setPasscode");
  }

  return (
    <List>
      <ListItem onPress={unsetAppPasscode}>
        <ListItemText
          style={styles.text}
          primary={<FormattedMessage {...m.usePasscode} />}
        />
        <CheckBox
          tintColors={{ false: MEDIUM_GREY }}
          onValueChange={unsetAppPasscode}
          value={passcodeSet}
        />
      </ListItem>
      <ListDivider />

      {/* User is not able to see this option unlesss they already have a pass */}
      {passcodeSet && (
        <ListItem
          onPress={() => {
            setScreenState("setPasscode");
          }}
          style={{ marginTop: 20 }}
        >
          <ListItemText
            style={styles.text}
            primary={<FormattedMessage {...m.changePasscode} />}
          />
        </ListItem>
      )}
    </List>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
