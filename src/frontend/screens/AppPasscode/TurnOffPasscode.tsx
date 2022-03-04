import * as React from "react";
import { View } from "react-native";
import { SecurityContext } from "../../context/SecurityContext";
import Button from "../../sharedComponents/Button";
import Text from "../../sharedComponents/Text";

export const TurnOffPasscode = () => {
  const [authState, setAuthState] = React.useContext(SecurityContext);

  return (
    <View>
      <Text></Text>
      <Button
        onPress={() => {
          setAuthState({ type: "setPasscode", newPasscode: null });
        }}
      >
        Turn Off App Passcode
      </Button>
    </View>
  );
};
