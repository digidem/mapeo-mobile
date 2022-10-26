import * as React from "react";
import { PasscodeScreens } from ".";
import { InputPasscode } from "./InputPasscode";
import { defineMessages } from "react-intl";
import { OBSCURE_PASSCODE } from "../../constants";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { SecurityContext } from "../../context/SecurityContext";

const m = defineMessages({
  titleSet: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleSet",
    defaultMessage: "Set App Passcode",
  },
  initialPassError: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.initialPassError",
    defaultMessage: "Password must be 5 numbers",
  },
  titleConfirm: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleConfirm",
    defaultMessage: "Re-enter Passcode",
  },
  subTitleSet: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleSet",
    defaultMessage: "This passcode will be required to open the Mapeo App",
  },
  passwordDoesNotMatch: {
    id:
      "screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordDoesNotMatch",
    defaultMessage: "Password does not match",
  },
  obscurePasscodeError: {
    id:
      "screens.AppPasscode.NewPasscode.InputPasscodeScreen.obscurePasscodeError",
    defaultMessage: "Cannot be used as a Passcode",
  },
});

type SetPasswordError =
  | {
      error: true;
      isObscurePassword: boolean;
    }
  | { error: false; isObscurePassword: false };

export const SetPassword = ({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<PasscodeScreens>>;
}) => {
  const [error, setError] = React.useState<SetPasswordError>({
    error: false,
    isObscurePassword: false,
  });
  const [initialPass, setInitialPass] = React.useState("");
  const [isConfirming, setIsConfirming] = React.useState(false);

  function setInitialPassWithErrorCheck(password: string) {
    if (error.error && password.length > 0)
      setError({ error: false, isObscurePassword: false });

    setInitialPass(password);
  }

  function validate() {
    if (initialPass === OBSCURE_PASSCODE) {
      setError({ error: true, isObscurePassword: true });
      setInitialPass("");
      return;
    }

    if (initialPass.length < 5) {
      setError({ error: true, isObscurePassword: false });
      return;
    }

    setIsConfirming(true);
  }

  if (!isConfirming) {
    return (
      <InputPasscode
        text={{
          title: m.titleSet,
          errorMessage: error.isObscurePassword
            ? m.obscurePasscodeError
            : m.initialPassError,
          subtitle: m.subTitleSet,
        }}
        validate={validate}
        error={error.error}
        showPasscodeValues={true}
        inputValue={initialPass}
        setInputValue={setInitialPassWithErrorCheck}
      />
    );
  }

  return <SetPasswordConfirm initialPass={initialPass} />;
};

const SetPasswordConfirm = ({ initialPass }: { initialPass: string }) => {
  const [error, setError] = React.useState(false);
  const { navigate } = useNavigationFromRoot();
  const { setAuthValues } = React.useContext(SecurityContext);

  const [confirmPass, setConfirmPass] = React.useState("");

  function confirmPassWithCheck(password: string) {
    if (error && password.length > 0) setError(false);
    setConfirmPass(password);
  }

  function validate() {
    if (confirmPass === initialPass) {
      setAuthValues({
        type: "passcode",
        value: confirmPass,
      });
      navigate("Security");
      return;
    }

    setError(true);
  }

  return (
    <InputPasscode
      text={{
        title: m.titleConfirm,
        errorMessage: m.passwordDoesNotMatch,
        subtitle: m.subTitleSet,
      }}
      validate={validate}
      error={error}
      showPasscodeValues={true}
      inputValue={confirmPass}
      setInputValue={confirmPassWithCheck}
    />
  );
};
