import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CompositeNavigationProp } from "@react-navigation/native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { MapScreen } from "../screens/MapScreen/MapScreen";
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
import { MapSettings } from "../screens/Settings/MapSettings";
import { BackgroundMaps } from "../screens/Settings/MapSettings/BackgroundMaps";
import { OfflineAreas } from "../screens/Settings/MapSettings/OfflineAreas";
import { BGMapsSettings } from "../screens/Settings/Experiments/BGMaps";

export type AppStackList = {
  Home: BottomTabNavigationProp<HomeTabsList> | undefined;
  GpsModal: undefined;
  SyncModal: undefined;
  Settings: undefined;
  ProjectConfig: undefined;
  AboutMapeo: undefined;
  LanguageSettings: undefined;
  CoordinateFormat: undefined;
  Experiments: undefined;
  PhotosModal: {
    photoIndex: number;
    observationId: string;
  };
  CategoryChooser: undefined;
  AddPhoto: undefined;
  ObservationList: undefined;
  Observation: { observationId: string };
  ObservationEdit: undefined;
  ManualGpsScreen: undefined;
  ObservationDetails: undefined;
  LeaveProjectScreen: undefined;
  AlreadyOnProj: undefined;
  AddToProjectScreen: undefined;
  UnableToLinkScreen: undefined;
  // To Do: This was called something else in previous navigation stack
  JoinProjectQrScreen: undefined;
  ConnectingToDeviceScreen: undefined;
  ConfirmLeavePracticeModeScreen: undefined;
  // To Do: This was called something else in previous navigation stack
  CreateProjectScreen: undefined;
  Security: undefined;
  AppPasscode: undefined;
  DirectionalArrow: undefined;
  P2pUpgrade: undefined;
  MapSettings: undefined;
  BackgroundMaps: undefined;
  OfflineAreas: undefined;
  BGMapsSettings: undefined;
};

export type StackNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<AppStackList>,
  BottomTabNavigationProp<HomeTabsList>
>;

type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
};

const Tab = createBottomTabNavigator<HomeTabsList>();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color }) => {
        let iconName: string;
        if (route.name === "Map") iconName = "map";
        else iconName = "photo-camera";
        return <MaterialIcons name={iconName} size={30} color={color} />;
      },
      header: () => <HomeHeader />,
      headerTransparent: true,
    })}
  >
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
  </Tab.Navigator>
);

// const HomeTabs = createBottomTabNavigator(
//   {
//     Map: MapScreen,
//     Camera: CameraScreen,
//   },
//   {
//     navigationOptions: () => ({
//       header: (props: any) => <HomeHeader {...props} />,
//       headerTransparent: true,
//     }),
//     defaultNavigationOptions: ({ navigation }) => ({
//       initialRouteName: "Map",
//       backBehavior: "initialRoute",
//       tabBarOptions: {
//         showLabel: false,
//       },
//       tabBarIcon: ({ tintColor }) => {
//         const { routeName } = navigation.state;
//         let iconName;
//         if (routeName === "Map") iconName = "map";
//         else iconName = "photo-camera";
//         return <MaterialIcons name={iconName} size={30} color={tintColor} />;
//       },
//       tabBarTestID: "tabBarButton" + navigation.state.routeName,
//     }),
//   }
// );

const Stack = createNativeStackNavigator<AppStackList>();

export const AppStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={route => ({
      presentation: "card",
      headerStyle: { backgroundColor: "#ffffff" },
      headerShown: route.route.name !== "Home",
      headerLeft: () => <CustomHeaderLeft />,
    })}
  >
    <Stack.Screen name="Home" component={HomeTabs} />
    <Stack.Screen name="AboutMapeo" component={AboutMapeo} />
    <Stack.Screen name="AddPhoto" component={AddPhoto} />
    <Stack.Screen name="AddToProjectScreen" component={AddToProjectScreen} />
    <Stack.Screen name="AlreadyOnProj" component={AlreadyOnProj} />
    <Stack.Screen name="AppPasscode" component={AppPasscode} />
    <Stack.Screen name="BGMapsSettings" component={BGMapsSettings} />
    <Stack.Screen name="BackgroundMaps" component={BackgroundMaps} />
    <Stack.Screen name="CategoryChooser" component={CategoryChooser} />
    <Stack.Screen
      name="ConfirmLeavePracticeModeScreen"
      component={ConfirmLeavePracticeModeScreen}
    />
    <Stack.Screen
      name="ConnectingToDeviceScreen"
      component={ConnectingToDeviceScreen}
    />
    <Stack.Screen name="CoordinateFormat" component={CoordinateFormat} />
    <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
    <Stack.Screen name="DirectionalArrow" component={DirectionalArrow} />
    <Stack.Screen name="Experiments" component={Experiments} />
    <Stack.Screen name="GpsModal" component={GpsModal} />
    <Stack.Screen name="JoinProjectQrScreen" component={JoinProjectQrScreen} />
    <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
    <Stack.Screen name="LeaveProjectScreen" component={LeaveProjectScreen} />
    <Stack.Screen name="ManualGpsScreen" component={ManualGpsScreen} />
    <Stack.Screen name="MapSettings" component={MapSettings} />
    <Stack.Screen name="Observation" component={Observation} />
    <Stack.Screen name="ObservationDetails" component={ObservationDetails} />
    <Stack.Screen name="ObservationEdit" component={ObservationEdit} />
    <Stack.Screen name="ObservationList" component={ObservationList} />
    <Stack.Screen name="OfflineAreas" component={OfflineAreas} />
    <Stack.Screen name="P2pUpgrade" component={P2pUpgrade} />
    <Stack.Screen name="PhotosModal" component={PhotosModal} />
    <Stack.Screen name="ProjectConfig" component={ProjectConfig} />
    <Stack.Screen name="Security" component={Security} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="SyncModal" component={SyncModal} />
    <Stack.Screen name="UnableToLinkScreen" component={UnableToLinkScreen} />
  </Stack.Navigator>
);

// const stackNavConfig= {
//   initialRouteName: "Home",
//   // TODO iOS: Dynamically set transition mode to modal for modals
//   mode: "card",
//   headerMode: "screen",
//   defaultNavigationOptions: {
//     headerStyle: {
//       height: 60,
//     },
//     // We use a slightly larger back icon, to improve accessibility
//     // TODO iOS: This should probably be a chevron not an arrow
//     headerLeft: props => <CustomHeaderLeft {...props} />,
//     headerTitleStyle: {
//       marginHorizontal: 0,
//     },
//     cardStyle: {
//       backgroundColor: "#ffffff",
//     },
//   },
// };
