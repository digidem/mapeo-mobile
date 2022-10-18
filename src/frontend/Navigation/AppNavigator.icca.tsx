import * as React from "react";
import { useIntl } from "react-intl";
import { Intro, Info } from "../screens/Intro";
import {
  createDefaultScreenGroup,
  NavigatorScreenOptions,
  RootStack,
} from "./AppStack";
import { SecurityContext } from "../context/SecurityContext";
import { useNavigationFromRoot } from "../hooks/useNavigationWithTypes";

export const AppNavigator = () => {
  const { formatMessage } = useIntl();
  const { authState } = React.useContext(SecurityContext);
  const navigation = useNavigationFromRoot();

  React.useEffect(() => {
    if (authState === "unauthenticated") {
      navigation.navigate("AuthScreen");
    }
  }, [authState, navigation]);

  return (
    <RootStack.Navigator
      initialRouteName="IccaIntro"
      screenOptions={NavigatorScreenOptions}
    >
      {/** NB: devExperiments not available in ICCA variant */}
      {createDefaultScreenGroup(formatMessage)}
      <RootStack.Group key="icca">
        <RootStack.Screen
          name="IccaIntro"
          component={Intro}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="IccaInfo" component={Info} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
