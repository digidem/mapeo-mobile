import * as React from "react";
import { View } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { SecurityContext } from "../Security/SecurityContext";
import { EnterPasscode } from "./EnterPasscode";
import { NewPasscode } from "./NewPasscode";

export const AppPasscode: NavigationStackScreenComponent = () => {
  const { passIsSet } = React.useContext(SecurityContext);

  return (
    <View>
      {!passIsSet && <NewPasscode />}
      {passIsSet && <EnterPasscode />}
    </View>
  );
};
