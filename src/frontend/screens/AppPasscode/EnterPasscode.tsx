import * as React from "react";
import Button from "../../sharedComponents/Button";
import Text from "../../sharedComponents/Text";
import { SecurityContext } from "../Security/SecurityContext";

export const EnterPasscode = () => {
  const { setPassIsSet } = React.useContext(SecurityContext);

  return (
    <React.Fragment>
      <Text>Under Construction</Text>
      <Button onPress={() => setPassIsSet(false)}>Turn Off App Passcode</Button>
    </React.Fragment>
  );
};
