import * as React from "react";
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";
import ProjectInviteContext from "../context/ProjectInviteContext";

export default function useProjectInviteListener<
  N extends NavigationScreenProp<NavigationState, NavigationParams>
>(navigation: N) {
  const { invite } = React.useContext(ProjectInviteContext);

  React.useEffect(() => {
    if (invite) {
      navigation.navigate("ProjectInviteModal");
    }
  }, [invite, navigation]);
}
