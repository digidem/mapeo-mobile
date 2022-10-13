import * as React from "react";
import { defineMessage } from "react-intl";
import { PasscodeScreens } from ".";
import { SecurityContext } from "../../context/SecurityContext";
import { InputPasscode } from "./InputPasscode";

const m = defineMessage({
  titleEnter: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.titleEnter",
    defaultMessage: "Enter Passcode",
  },
  subTitleEnter: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleEnter",
    defaultMessage: "Please Enter Password",
  },
  passwordError: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordError",
    defaultMessage: "Incorrect Password",
  },
});

export const EnterPassToTurnOff = ({
  setScreenState,
}: {
  setScreenState: React.Dispatch<React.SetStateAction<PasscodeScreens>>;
}) => {
  const { authenticate } = React.useContext(SecurityContext);
  const [error, setError] = React.useState(false);
  const [pass, setPass] = React.useState("");

  function validate() {
    if (!authenticate(pass, { validateOnly: true })) {
      setError(true);
      return;
    }
    setScreenState("disablePasscode");
  }

  function setPassWithValidation(passValue: string) {
    if (error && passValue.length > 0) {
      setError(false);
    }

    setPass(passValue);
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
      inputValue={pass}
      setInputValue={setPassWithValidation}
    />
  );
};
