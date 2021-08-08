import React from "react";
import { useState } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import {
  NavigationStackProp,
  NavigationStackScreenComponent,
  NavigationStackScreenProps,
} from "react-navigation-stack";
import { LeaveProjectCompleted } from "./LeaveProjectCompleted";
import { LeaveProjectInitial } from "./LeaveProjectInitial";
import { LeaveProjectProgress } from "./LeaveProjectProgess";
import HeaderTitle from "../../sharedComponents/HeaderTitle";

const m = defineMessages({
  headerTitle: {
    id: "screens.LeaveProject.LeaveProject",
    defaultMessage: "Leave Project",
  },
});

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

const LeaveProjectScreen: NavigationStackScreenComponent = ({
  navigation,
  screenProps,
  theme,
}: NavigationStackScreenProps) => {
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
