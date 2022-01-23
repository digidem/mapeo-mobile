import * as React from "react";
import { View } from "react-native";
import { PasscodeIntro } from "./PasscodeIntro";

enum ScreenState {
  splash,
  setPasscode,
  reenterPasscode,
}

export const NewPasscode = () => {
  const [screenState, setScreenState] = React.useState<ScreenState>(
    ScreenState.splash
  );

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
    return <React.Fragment></React.Fragment>;
  }

  //To-Do Create Confirm passcode Screen
  return <React.Fragment></React.Fragment>;
};
