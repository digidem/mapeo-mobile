// @flow
import React from "react";
import { type NavigationScreenProp } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { StatusBar } from "react-native";
import { IntroPager, IntroInfo } from "@digidem/wcmc-mapeo-mobile-intro";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import CustomHeaderLeft from "../../sharedComponents/CustomHeaderLeft";

type InfoNavigationState = {|
  params: {|
    introInfoText: string,
    introInfoTitle: string
  |}
|};

const Info = ({
  navigation
}: {
  navigation: NavigationScreenProp<InfoNavigationState>
}) => {
  const text = navigation.getParam("introInfoText");

  return (
    <>
      <StatusBar hidden={false} />
      <IntroInfo markdownText={text} />
    </>
  );
};

Info.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("introInfoTitle", "Info"),
  headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>
});

const Intro = ({
  navigation
}: {
  navigation: NavigationScreenProp<InfoNavigationState>
}) => {
  const handleShowInfo = React.useCallback(
    ({ title, text }) => {
      navigation.navigate("Info", {
        introInfoTitle: title,
        introInfoText: text
      });
    },
    [navigation]
  );
  const handlePressComplete = React.useCallback(() => {
    navigation.navigate("App");
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

Intro.navigationOptions = {
  headerShown: false
};

export default createStackNavigator(
  {
    Intro,
    Info
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        height: 60
      },
      headerLeft: props => <CustomHeaderLeft {...props} />,
      headerTitleStyle: {
        marginHorizontal: 0
      },
      cardStyle: {
        backgroundColor: "#ffffff"
      }
    }
  }
);
