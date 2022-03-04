import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View } from "react-native";
import { useNavigation } from "react-navigation-hooks";

import { PasscodeScreens } from ".";
import { SecurityContext } from "../../context/SecurityContext";
import { PasswordInput } from "../../sharedComponents/PasswordInput";
import Text from "../../sharedComponents/Text";

const m = defineMessages({
  titleSet: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleSet",
    defaultMessage: "Set Passcode",
  },
  titleConfirm: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleConfirm",
    defaultMessage: "Re-enter Passcode",
  },
  titleEnter: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.titleEnter",
    defaultMessage: "Enter Passcode",
  },
  subTitleSet: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleSet",
    defaultMessage: "Please Type Pass",
  },
  subTitleConfirm: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleConfirm",
    defaultMessage: "Password",
  },
  subTitleEnter: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleEnter",
    defaultMessage: "Please Enter Password",
  },
  passwordDoesNotMatch: {
    id:
      "screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordDoesNotMatch",
    defaultMessage: "Password Does not match",
  },
  passwordError: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordError",
    defaultMessage: "Error with Pass",
  },
});

interface SetPasscodeProps {
  screenState: PasscodeScreens;
  setScreenState: React.Dispatch<React.SetStateAction<PasscodeScreens>>;
}

export const InputPasscodeScreen = ({
  screenState,
  setScreenState,
}: SetPasscodeProps) => {
  const [error, setError] = React.useState(false);
  const initialPassword = React.useRef("");
  const [authState, setAuthState] = React.useContext(SecurityContext);
  const { navigate } = useNavigation();

  //This checks that the user cannot be in the confirm passcode screen if they have not typed in an initial passcode
  React.useEffect(() => {
    if (screenState === "confirmSetPasscode" && !initialPassword.current) {
      setScreenState("intro");
    }
  }, [screenState]);

  const [title, subtitle, errorMessage] = React.useMemo(() => {
    if (screenState === "setPasscode") {
      return [m.titleSet, m.titleConfirm];
    }

    if (screenState === "confirmSetPasscode") {
      return [m.titleConfirm, m.subTitleConfirm, m.passwordDoesNotMatch];
    }

    return [m.titleEnter, m.subTitleEnter, m.passwordError];
  }, [screenState]);

  function onError() {
    setError(true);
  }

  function correctPass(inputtedValue: string, clearInput: () => void) {
    if (screenState === "setPasscode") {
      initialPassword.current = inputtedValue;

      clearInput();
      setScreenState("confirmSetPasscode");
      return;
    }

    if (screenState === "confirmSetPasscode") {
      if (inputtedValue === initialPassword.current) {
        setAuthState({ type: "setPasscode", newPasscode: inputtedValue });
        initialPassword.current = "";
        navigate("Security");
        return;
      }

      setError(true);
      clearInput();
      return;
    }

    if (screenState === "enterPasscode") {
      if (inputtedValue === authState.passcode) {
        setScreenState("disablePasscode");
        return;
      }

      setError(true);
      clearInput();
      return;
    }
  }

  return (
    <View>
      <Text>
        <FormattedMessage {...title} />
      </Text>
      <Text>
        <FormattedMessage {...subtitle} />
      </Text>

      <PasswordInput
        handleError={onError}
        autoFocus={true}
        clearError={() => {
          setError(false);
        }}
        handleCorrectOrNewPass={correctPass}
      />

      {error && !!errorMessage && (
        <Text>
          <FormattedMessage {...errorMessage} />
        </Text>
      )}
    </View>
  );
};
