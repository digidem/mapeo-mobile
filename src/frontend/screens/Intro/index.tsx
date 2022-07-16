import * as React from "react";
import { StatusBar } from "react-native";
import { IntroPager, IntroInfo } from "@digidem/wcmc-mapeo-mobile-intro";

import { NativeRootNavigationProps } from "../../sharedTypes";
import { useSetHeader } from "../../hooks/useSetHeader";
import { RootStack } from "../../Navigation/AppStack";

export type IccaStackList = {
  IccaInfo: {
    introInfoText: string;
    introInfoTitle: string;
  };
  IccaIntro: undefined;
};

const Info = ({ route }: NativeRootNavigationProps<"IccaInfo">) => {
  const text = route.params.introInfoText;
  const title = route.params.introInfoTitle;

  useSetHeader({ headerTitle: title });
  return (
    <>
      <StatusBar hidden={false} />
      <IntroInfo markdownText={text} />
    </>
  );
};
const Intro = ({ navigation }: NativeRootNavigationProps<"IccaIntro">) => {
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
    navigation.navigate("Home", { screen: "Map" });
  }, [navigation]);
  return (
    <>
      <StatusBar hidden />
      <IntroPager
        onShowInfo={handleShowInfo}
        onPressComplete={handlePressComplete}
      />
    </>
  );
};

export const IccaStack = () => (
  <>
    <RootStack.Screen
      name="IccaIntro"
      component={Intro}
      options={{ headerShown: false }}
    />
    <RootStack.Screen name="IccaInfo" component={Info} />
  </>
);