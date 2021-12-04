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

  if (screenState === ScreenState.splash) {
    return <SplashScreen />;
  }

  if (screenState === ScreenState.setPasscode) {
    return <React.Fragment></React.Fragment>;
  }

  return <React.Fragment></React.Fragment>;
};
