import * as React from "react";
import { SecurityContext } from "../../context/SecurityContext";
import Button from "../../sharedComponents/Button";
import Text from "../../sharedComponents/Text";

export const EnterPasscode = () => {
  const [authState, setAuthState] = React.useContext(SecurityContext);

  return (
    <React.Fragment>
      <Text>{authState.passcode}</Text>
      <Button
        onPress={() => {
          setAuthState({ type: "setPasscode", newPasscode: null });
        }}
      >
        Turn Off App Passcode
      </Button>
    </React.Fragment>
  );
};
