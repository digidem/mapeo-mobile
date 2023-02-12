import * as React from "react";
import { defineMessages } from "react-intl";

import { SecurityContext } from "../../context/SecurityContext";
import { NativeNavigationComponent } from "../../sharedTypes";
import { InputPasscode } from "./InputPasscode";

const m = defineMessages({
  titleEnter: {
    id: "screens.AppPasscode.EnterPassToTurnOff.titleEnter",
    defaultMessage: "Enter Passcode",
  },
  subTitleEnter: {
    id: "screens.AppPasscode.EnterPassToTurnOff.subTitleEnter",
    defaultMessage: "Please Enter Passcode",
  },
  passwordError: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordError",
    defaultMessage: "Incorrect Passcode",
  },
  title: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.title",
    defaultMessage: "Confirm Passcode",
  },
});

export const EnterPassToTurnOff: NativeNavigationComponent<"EnterPassToTurnOff"> = ({
  navigation,
}) => {
  const { authenticate, authValuesSet } = React.useContext(SecurityContext);
  const [error, setError] = React.useState(false);
  const { navigate } = navigation;

  // Stops user from accessing this page if no password is set
  React.useLayoutEffect(() => {
    if (!authValuesSet.passcodeSet) {
      navigate("Security");
    }
  }, [navigate, authValuesSet]);

  function validate(passcode: string) {
    if (!authenticate(passcode, true)) {
      setError(true);
      return;
    }
    navigate("DisablePasscode");
  }

  return (
    <InputPasscode
      text={{
        errorMessage: m.passwordError,
        subtitle: m.subTitleEnter,
        title: m.titleEnter,
      }}
      error={error}
      validate={validate}
      showNext={false}
      hideError={() => setError(false)}
    />
  );
};

EnterPassToTurnOff.navTitle = m.title;
