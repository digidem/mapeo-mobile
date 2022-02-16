import * as React from "react";
import { View } from "react-native";
import { SecurityContext } from "../../context/SecurityContext";
import Button from "../../sharedComponents/Button";
import Text from "../../sharedComponents/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PASSWORD_KEY } from "../../constants";

export const EnterPasscode = () => {
  const { passcode, setPasscode } = React.useContext(SecurityContext);

  return (
    <React.Fragment>
      <Text>{passcode}</Text>
      <Button
        onPress={() => {
          setPasscode(null);
        }}
      >
        Turn Off App Passcode
      </Button>
    </React.Fragment>
  );
};
