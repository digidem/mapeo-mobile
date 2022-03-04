import * as React from "react";
import { View } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { useNavigation } from "react-navigation-hooks";
import { defineMessages, FormattedMessage } from "react-intl";

import { SecurityContext } from "../../context/SecurityContext";
import Text from "../../sharedComponents/Text";

const m = defineMessages({
  turnOff: {
    id: "screens.AppPasscode.TurnOffPasscode.TurnOff",
    defaultMessage: "Continue",
  },
});

export const TurnOffPasscode = () => {
  const [{ passcode }, setAuthState] = React.useContext(SecurityContext);
  const { navigate } = useNavigation();

  //This will make sure that user can only see the screen when a password is set
  React.useEffect(() => {
    if (!passcode) navigate("Security");
  }, []);

  //Set timeout allows the user to see that they have unchecked the checkbox before they are navigated away (avoids it looking glitchy) To Do: Talk to sabella to determine a better way for user feedback!
  React.useEffect(() => {
    if (!passcode) {
      setTimeout(() => {
        navigate("Security");
      }, 2000);
    }
  }, [passcode]);

  function unsetAppPasscode() {
    setAuthState({ type: "setPasscode", newPasscode: null });
  }

  return (
    <View>
      <Text>
        <FormattedMessage {...m.turnOff} />
      </Text>
      <CheckBox
        onValueChange={unsetAppPasscode}
        value={passcode != undefined}
      />
    </View>
  );
};
