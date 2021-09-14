import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MapScreen from "../screens/MapScreen";
import CameraScreen from "../screens/CameraScreen";
import ObservationList from "../screens/ObservationsList";
import Observation from "../screens/Observation";
import ObservationEdit from "../screens/ObservationEdit";
import AddPhoto from "../screens/AddPhoto";
import ObservationDetails from "../screens/ObservationDetails";
import CategoryChooser from "../screens/CategoryChooser";
import GpsModal from "../screens/GpsModal";
import SyncModal from "../screens/SyncModal";
import Settings from "../screens/Settings";
import PhotosModal from "../screens/PhotosModal";
import ManualGpsScreen from "../screens/ManualGpsScreen";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";
import ProjectConfig from "../screens/Settings/ProjectConfig";
import AboutMapeo from "../screens/Settings/AboutMapeo";
import LanguageSettings from "../screens/Settings/LanguageSettings";
import CoordinateFormat from "../screens/Settings/CoordinateFormat";
import { HomeHeader } from "../sharedComponents/HomeHeader";
import { AlreadyOnProj } from "../screens/AlreadyOnProject";
import { LeaveProjectScreen } from "../screens/LeaveProject";
import { AddToProjectScreen } from "../screens/AddToProjectScreen";
import { UnableToLinkScreen } from "../screens/UnableToLink";
import { JoinProjectQrScreen } from "../screens/Onboarding";
import { ConnectingToDeviceScreen } from "../screens/ConnectingToDeviceScreen";

const HomeTabs = createBottomTabNavigator(
  {
    Map: MapScreen,
    Camera: CameraScreen,
  },
  {
    navigationOptions: () => ({
      header: (props: any) => <HomeHeader {...props} />,
      headerTransparent: true,
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      initialRouteName: "Map",
      backBehavior: "initialRoute",
      tabBarOptions: {
        showLabel: false,
      },
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Map") iconName = "map";
        else iconName = "photo-camera";
        return <MaterialIcons name={iconName} size={30} color={tintColor} />;
      },
      tabBarTestID: "tabBarButton" + navigation.state.routeName,
    }),
  }
);

export const AppStack = createStackNavigator(
  {
    Home: HomeTabs,
    GpsModal: GpsModal,
    SyncModal: SyncModal,
    Settings: Settings,
    ProjectConfig: ProjectConfig,
    AboutMapeo,
    LanguageSettings,
    CoordinateFormat,
    PhotosModal: PhotosModal,
    CategoryChooser: CategoryChooser,
    AddPhoto: AddPhoto,
    ObservationList: ObservationList,
    Observation: Observation,
    ObservationEdit: ObservationEdit,
    ManualGpsScreen: ManualGpsScreen,
    ObservationDetails: ObservationDetails,
    LeaveProjectScreen: LeaveProjectScreen,
    AlreadyOnProj: AlreadyOnProj,
    AddToProject: AddToProjectScreen,
    UnableToLink: UnableToLinkScreen,
    JoinProjectQr: JoinProjectQrScreen,
    ConnectingToDevice: ConnectingToDeviceScreen,
  },
  {
    initialRouteName: "Home",
    ...Platform.select({
      // float doesn't play nicely with the HomeHeader component we have for the tab navigator
      // ios: { mode: "modal", headerMode: "float" },
      ios: { mode: "modal", headerMode: "screen" },
      android: { mode: "card", headerMode: "screen" },
    }),
    defaultNavigationOptions: {
      headerStyle: Platform.OS === "android" && {
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
