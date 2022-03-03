import * as React from "react";
import { View } from "react-native";
import { ScreenState } from ".";

interface SetPasscodeProps {
  screenState: ScreenState;
  setScreenState: () => {};
}

export const SetPasscode = ({
  screenState,
  setScreenState,
}: SetPasscodeProps) => {
  return <View></View>;
};
