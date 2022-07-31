import * as React from "react";
import { StatusBar } from "react-native";
import { IntroPager, IntroInfo } from "@digidem/wcmc-mapeo-mobile-intro";

import { useSetHeader } from "../../hooks/useSetHeader";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { NavigatorScreenOptions } from "../../Navigation/AppStack";
import { CompositeScreenProps } from "@react-navigation/native";
import { IccaStackListRoot } from "../../Navigation/AppNavigator.icca";

export type IccaStackList = {
  IccaInfo: {
    introInfoText: string;
    introInfoTitle: string;
  };
  IccaIntro: undefined;
};

const IccaStack = createNativeStackNavigator<IccaStackList>();

type IccaNavProps<
  ScreenName extends keyof IccaStackList
> = CompositeScreenProps<
  NativeStackScreenProps<IccaStackList, ScreenName>,
  NativeStackScreenProps<IccaStackListRoot>
>;

const Info = ({ route }: IccaNavProps<"IccaInfo">) => {
  const text = route.params.introInfoText;
  const title = route.params.introInfoTitle;

  useSetHeader({ headerTitle: title });
  return (
    <React.Fragment>
      <StatusBar hidden={false} />
      <IntroInfo markdownText={text} />
    </React.Fragment>
  );
};
const Intro = ({ navigation }: IccaNavProps<"IccaIntro">) => {
  const handleShowInfo = React.useCallback(
    ({ title, text }) => {
      navigation.navigate("IccaInfo", {
        introInfoTitle: title,
        introInfoText: text,
      });
    },
    [navigation]
  );
  const handlePressComplete = React.useCallback(() => {
    navigation.navigate("App");
  }, [navigation]);
  return (
    <React.Fragment>
      <StatusBar hidden />
      <IntroPager
        onShowInfo={handleShowInfo}
        onPressComplete={handlePressComplete}
      />
    </React.Fragment>
  );
};

export const IccaStackNav = () => (
  <IccaStack.Navigator screenOptions={NavigatorScreenOptions}>
    <IccaStack.Screen
      name="IccaIntro"
      component={Intro}
      options={{ headerShown: false }}
    />
    <IccaStack.Screen name="IccaInfo" component={Info} />
  </IccaStack.Navigator>
);
