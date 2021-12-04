import * as React from "react";
import { View } from "react-native";
import { SplashScreen } from "./splash";

enum ScreenState {
  splash,
  setPasscode,
  reenterPasscode,
}

export const NewPasscode = () => {
  const [screenState, setScreenState] = React.useState<ScreenState>(
    ScreenState.splash
  );

  function incrementState() {
    setScreenState(prevState => prevState + 1);
  }

  if (screenState === ScreenState.splash) {
    return <SplashScreen incrementState={incrementState} />;
  }

  //To-Do Create Set Passcode Screen
  if (screenState === ScreenState.setPasscode) {
    return <React.Fragment></React.Fragment>;
  }

  //To-Do Create Confirm passcode Screen
  return <React.Fragment></React.Fragment>;
};
