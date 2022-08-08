import * as React from "react";
import { StatusBar } from "react-native";
import { IntroPager, IntroInfo } from "@digidem/wcmc-mapeo-mobile-intro";

import { useSetHeader } from "../../hooks/useSetHeader";

import { NativeRootNavigationProps } from "../../sharedTypes";

export type IccaStackList = {
  IccaInfo: {
    introInfoText: string;
    introInfoTitle: string;
  };
  IccaIntro: undefined;
};

// type IccaNavProps<ScreenName extends keyof IccaStackList> = CompositeScreenProps<
//   NativeStackScreenProps<IccaStackList, ScreenName>,
//   NativeStackScreenProps<IccaStackListRoot>
// >;

export const Info = ({ route }: NativeRootNavigationProps<"IccaInfo">) => {
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
