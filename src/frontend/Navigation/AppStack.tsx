import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {
  CreateNavigatorConfig,
  NavigationRouteConfigMap,
  NavigationStackRouterConfig,
} from "react-navigation";
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
import { ProjectConfig } from "../screens/Settings/ProjectConfig";
import AboutMapeo from "../screens/Settings/AboutMapeo";
import LanguageSettings from "../screens/Settings/LanguageSettings";
import CoordinateFormat from "../screens/Settings/CoordinateFormat";
import Experiments from "../screens/Settings/Experiments";
import HomeHeader from "../sharedComponents/HomeHeader";
import { AlreadyOnProj } from "../screens/AlreadyOnProject";
import { LeaveProjectScreen } from "../screens/LeaveProject";
import { AddToProjectScreen } from "../screens/AddToProjectScreen";
import { UnableToLinkScreen } from "../screens/UnableToLink";
import { JoinProjectQrScreen } from "../screens/Onboarding";
import { ConnectingToDeviceScreen } from "../screens/ConnectingToDeviceScreen";
import { ConfirmLeavePracticeModeScreen } from "../screens/ConfirmLeavePracticeModeScreen";
import { CreateProjectScreen } from "../screens/CreateProject";
import { Security } from "../screens/Security";
import { AppPasscode } from "../screens/AppPasscode";
import { DirectionalArrow } from "../screens/Settings/Experiments/DirectionalArrow";
import { P2pUpgrade } from "../screens/Settings/Experiments/P2pUpgrade";
import {
  StackNavigationConfig,
  StackNavigationOptions,
  StackNavigationProp,
} from "react-navigation-stack/lib/typescript/src/vendor/types";
import { MapSettings } from "../screens/Settings/MapSettings";
import { BackgroundMaps } from "../screens/Settings/MapSettings/BackgroundMaps";
import { OfflineAreas } from "../screens/Settings/MapSettings/OfflineAreas";

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

export const AppStackMap: NavigationRouteConfigMap<
  StackNavigationOptions,
  StackNavigationProp
> = {
  Home: HomeTabs,
  GpsModal: GpsModal,
  SyncModal: SyncModal,
  Settings: Settings,
  ProjectConfig: ProjectConfig,
  AboutMapeo,
  LanguageSettings,
  CoordinateFormat,
  Experiments,
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
  ConfirmLeavePracticeMode: ConfirmLeavePracticeModeScreen,
  CreateProject: CreateProjectScreen,
  Security: Security,
  AppPasscode: AppPasscode,
  DirectionalArrow,
  P2pUpgrade,
  MapSettings,
  BackgroundMaps,
  OfflineAreas,
};

export const stackNavConfig: CreateNavigatorConfig<
  StackNavigationConfig,
  NavigationStackRouterConfig,
  StackNavigationOptions,
  StackNavigationProp
> = {
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
};

export const AppStack = createStackNavigator(AppStackMap, stackNavConfig);
