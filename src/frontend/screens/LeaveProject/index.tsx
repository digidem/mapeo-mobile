import React from "react";
import { useState } from "react";
import { defineMessages } from "react-intl";
import { NativeNavigationComponent } from "../../sharedTypes";

import { LeaveProjectCompleted } from "./LeaveProjectCompleted";
import { LeaveProjectInitial } from "./LeaveProjectInitial";
import { LeaveProjectProgress } from "./LeaveProjectProgess";

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

export interface LeaveProjSharedProp {
  next: () => void;
}

export const LeaveProjectScreen: NativeNavigationComponent<"LeaveProjectScreen"> = ({
  navigation,
}) => {
  const { initial, progress } = ScreenStates;
  const [screen, setScreen] = useState(initial);

  function nextScreenState() {
    setScreen(previousScreen => previousScreen + 1);
  }

  if (screen === initial) {
    return <LeaveProjectInitial next={nextScreenState} />;
  }

  if (screen === progress) {
    return (
      <LeaveProjectProgress next={nextScreenState} navigation={navigation} />
    );
  }

  return <LeaveProjectCompleted />;
};

LeaveProjectScreen.navTitle = m.headerTitle;
