import * as React from "react";
import { StatusBar } from "react-native";
import { IntroPager, IntroInfo } from "@digidem/wcmc-mapeo-mobile-intro";

import { NativeRootNavigationProps } from "../../sharedTypes";

export type IccaStackList = {
  IccaInfo: {
    introInfoText: string;
    introInfoTitle: string;
  };
  IccaIntro: undefined;
};

export const Info = ({
  route,
  navigation,
}: NativeRootNavigationProps<"IccaInfo">) => {
  const text = route.params.introInfoText;
  const title = route.params.introInfoTitle;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });
  }, [navigation, title]);

  return (
    <React.Fragment>
      <StatusBar hidden={false} />
      <IntroInfo markdownText={text} />
    </React.Fragment>
  );
};
export const Intro = ({
  navigation,
}: NativeRootNavigationProps<"IccaIntro">) => {
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
    <React.Fragment>
      <StatusBar hidden />
      <IntroPager
        onShowInfo={handleShowInfo}
        onPressComplete={handlePressComplete}
      />
    </React.Fragment>
  );
};
