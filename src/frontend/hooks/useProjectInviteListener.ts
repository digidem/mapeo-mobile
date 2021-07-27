import * as React from "react";
import { useNavigation } from "react-navigation-hooks";
import ProjectInviteContext from "../context/ProjectInviteContext";

export default function useProjectInviteListener() {
  const navigation = useNavigation();
  const { invite } = React.useContext(ProjectInviteContext);

  React.useEffect(() => {
    if (invite) {
      navigation.navigate("ProjectInviteModal");
    }
  }, [invite, navigation]);
}
