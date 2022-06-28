import React from "react";
import { useState } from "react";
import { defineMessages } from "react-intl";

import { LeaveProjectCompleted } from "./LeaveProjectCompleted";
import { LeaveProjectInitial } from "./LeaveProjectInitial";
import { LeaveProjectProgress } from "./LeaveProjectProgess";
import { useSetHeader } from "../../hooks/useSetHeader";

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

export const LeaveProjectScreen = () => {
  const { initial, progress } = ScreenStates;
  const [screen, setScreen] = useState(initial);

  useSetHeader({ headerTitle: m.headerTitle });

  function nextScreenState() {
    setScreen(previousScreen => previousScreen + 1);
  }

  if (screen === initial) {
    return <LeaveProjectInitial next={nextScreenState} />;
  }

  if (screen === progress) {
    return <LeaveProjectProgress next={nextScreenState} />;
  }

  return <LeaveProjectCompleted />;
};
