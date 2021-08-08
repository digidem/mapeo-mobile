import React from "react";
import { useState } from "react";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { LeaveProjectCompleted } from "./LeaveProjectCompleted";
import { LeaveProjectInitial } from "./LeaveProjectInitial";
import { LeaveProjectProgress } from "./LeaveProjectProgess";

enum ScreenStates {
  initial,
  progress,
  completed,
}

export interface ILeaveSharedProp {
  screenStateHook: [
    ScreenStates,
    React.Dispatch<React.SetStateAction<ScreenStates>>
  ];
}

const LeaveProjectScreen = () => {
  const { initial, progress, completed } = ScreenStates;
  const [screen, setScreen] = useState(initial);

  if (screen === initial) {
    return <LeaveProjectInitial screenStateHook={[screen, setScreen]} />;
  }

  if (screen === progress) {
    return <LeaveProjectProgress screenStateHook={[screen, setScreen]} />;
  }

  return <LeaveProjectCompleted screenStateHook={[screen, setScreen]} />;
};

export default LeaveProjectScreen;
