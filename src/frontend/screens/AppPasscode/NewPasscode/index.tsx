import * as React from "react";
import { View } from "react-native";
import { ConfirmPasscode } from "./ConfirmPasscode";
import { PasscodeIntro } from "./PasscodeIntro";
import { SetPasscode } from "./SetPasscode";

enum ScreenState {
  splash,
  setPasscode,
  reenterPasscode,
}

interface PasswordVerification {
  firstInputtedPass?: string;
  secondInputtedPass?: string;
}

export const NewPasscode = () => {
  const [screenState, setScreenState] = React.useState<ScreenState>(
    ScreenState.splash
  );

  //To do pass this to all the screen states
  const passwords = React.useRef<PasswordVerification>({});

  function setFirstPassword(inputtedPass: string) {
    passwords.current = { ...passwords, firstInputtedPass: inputtedPass };
    incrementState();
  }

  function setConfirmationPassword(inputtedPass: string) {
    passwords.current = { ...passwords, secondInputtedPass: inputtedPass };
    incrementState();
  }

  function incrementState(forward: boolean = true) {
    if (!forward) {
      setScreenState(prevState => prevState - 1);
    }

    setScreenState(prevState => prevState + 1);
  }

  if (screenState === ScreenState.splash) {
    return <PasscodeIntro incrementState={incrementState} />;
  }

  //To-Do Create Set Passcode Screen
  if (screenState === ScreenState.setPasscode) {
    return <SetPasscode setInitialPass={setFirstPassword} />;
  }

  //To-Do Create Confirm passcode Screen
  return <ConfirmPasscode />;
};
