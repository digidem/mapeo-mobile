// @flow
import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BuildConfig from "react-native-build-config";

import MapScreen from "./screens/MapScreen";
import CameraScreen from "./screens/CameraScreen";
import ObservationList from "./screens/ObservationsList";
import Observation from "./screens/Observation";
import ObservationEdit from "./screens/ObservationEdit";
import AddPhoto from "./screens/AddPhoto";
import ObservationDetails from "./screens/ObservationDetails";
import CategoryChooser from "./screens/CategoryChooser";
import GpsModal from "./screens/GpsModal";
import SyncModal from "./screens/SyncModal";
import Settings from "./screens/Settings";
import PhotosModal from "./screens/PhotosModal";
import ManualGpsScreen from "./screens/ManualGpsScreen";
import CustomHeaderLeft from "./sharedComponents/CustomHeaderLeft";
import ProjectConfig from "./screens/Settings/ProjectConfig";
import LanguageSettings from "./screens/Settings/LanguageSettings";
import IntroStack from "./screens/Intro";
import HomeHeader from "./sharedComponents/HomeHeader";

const HomeTabs = createBottomTabNavigator(
  {
    Map: MapScreen,
    Camera: CameraScreen,
  },
  // $FlowFixMe
  {
    navigationOptions: () => ({
      header: props => <HomeHeader {...props} />,
      headerTransparent: true,
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      initialRouteName: "Map",
      backBehavior: "initialRoute",
      tabBarOptions: {
        showLabel: false,
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Map") iconName = "map";
        else iconName = "photo-camera";
        return <MaterialIcons name={iconName} size={30} color={tintColor} />;
      },
    }),
  }
);

const AppStack = createStackNavigator(
  // $FlowFixMe - flow definitions don't recognize static props on function components
  {
    Home: HomeTabs,
    // $FlowFixMe
    GpsModal: GpsModal,
    // $FlowFixMe
    SyncModal: SyncModal,
    Settings: Settings,
    // $FlowFixMe
    ProjectConfig: ProjectConfig,
    // $FlowFixMe
    LanguageSettings,
    // $FlowFixMe
    PhotosModal: PhotosModal,
    // $FlowFixMe
    CategoryChooser: CategoryChooser,
    // $FlowFixMe
    AddPhoto: AddPhoto,
    // $FlowFixMe
    ObservationList: ObservationList,
    // $FlowFixMe
    Observation: Observation,
    // $FlowFixMe
    ObservationEdit: ObservationEdit,
    ManualGpsScreen: ManualGpsScreen,
    ObservationDetails: ObservationDetails,
  },
  {
    initialRouteName: "Home",
    // TODO iOS: Dynamically set transition mode to modal for modals
    mode: "card",
    headerMode: "screen",
    defaultNavigationOptions: {
      headerStyle: {
        height: 60,
      },
      // We use a slightly larger back icon, to improve accessibility
      // TODO iOS: This should probably be a chevron not an arrow
      headerLeft: props => <CustomHeaderLeft {...props} />,
      headerTitleStyle: {
        marginHorizontal: 0,
      },
      cardStyle: {
        backgroundColor: "#ffffff",
      },
    },
  }
);

const RootStack = createSwitchNavigator(
  {
    Intro: IntroStack,
    App: AppStack,
  },
  {
    initialRouteName: "Intro",
  }
);

// $FlowFixMe
export default createAppContainer(
  BuildConfig.FLAVOR === "icca" ? RootStack : AppStack
);
