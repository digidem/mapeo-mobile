import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigatorScreenParams } from "@react-navigation/native";

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
import { devExperiments } from "../lib/DevExperiments";
import { NewPasscode } from "../screens/AppPasscode/NewPasscode";
import { JoinRequestModal } from "../screens/JoinRequestModal";
import { ProjectInviteModal } from "../screens/ProjectInviteModal";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
  SyncOnboardingScreen,
} from "../screens/Onboarding";
import { MODAL_NAVIGATION_OPTIONS } from "../sharedComponents/BottomSheetModal";
import {
  HeaderButtonProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack/lib/typescript/src/types";
export type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
  other: undefined;
};

type OnboardingStackList = {
  JoinProjectQrScreen: { isAdmin: boolean };
  CreateOrJoinScreen: undefined;
  SendJoinRequestScreen: undefined;
  SyncOnboardingScreen: { keepExistingObservations: boolean };
  ProjectInviteModal: { inviteKey: string };
  JoinRequestModal: { deviceName?: string; key?: string } | undefined;
};

export type AppStackList = {
  Home: NavigatorScreenParams<HomeTabsList>;
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
    editing: boolean;
  };
  CategoryChooser: undefined;
  AddPhoto: undefined;
  ObservationList: undefined;
  Observation: { observationId: string };
  ObservationEdit: { observationId: string } | undefined;
  ManualGpsScreen: undefined;
  ObservationDetails: { question: number };
  LeaveProjectScreen: undefined;
  AlreadyOnProj: undefined;
  AddToProjectScreen: undefined;
  UnableToLinkScreen: undefined;
  ConnectingToDeviceScreen: { task: () => Promise<void> };
  ConfirmLeavePracticeModeScreen: { projectAction: "join" | "create" };
  CreateProjectScreen: undefined;
  Security: undefined;
  AppPasscode: undefined;
  DirectionalArrow: undefined;
  P2pUpgrade: undefined;
  MapSettings: undefined;
  BackgroundMaps: undefined;
  OfflineAreas: { mapId: string };
  BGMapsSettings: undefined;
  NewPasscode: undefined;
} & OnboardingStackList;

const Tab = createBottomTabNavigator<HomeTabsList>();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color }) => {
        const iconName = route.name === "Map" ? "map" : "photo-camera";
        return <MaterialIcons name={iconName} size={30} color={color} />;
      },
      header: () => <HomeHeader />,
      headerTransparent: true,
      tabBarTestID: "tabBarButton" + route.name,
    })}
    initialRouteName="Map"
    backBehavior="initialRoute"
  >
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
  </Tab.Navigator>
);

export const RootStack = createNativeStackNavigator<AppStackList>();

export const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: "card",
  headerStyle: { backgroundColor: "#ffffff" },
  headerLeft: (props: HeaderButtonProps) => (
    <CustomHeaderLeft headerBackButtonProps={props} />
  ),
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};

export const AppStack = () => (
  <RootStack.Navigator
    initialRouteName="Home"
    screenOptions={route => ({
      ...NavigatorScreenOptions,
      headerShown: route.route.name !== "Home",
    })}
  >
    <RootStack.Group>
      <RootStack.Screen name="Home" component={HomeTabs} />
      <RootStack.Screen name="AboutMapeo" component={AboutMapeo} />
      <RootStack.Screen
        name="AddPhoto"
        component={AddPhoto}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AddToProjectScreen"
        component={AddToProjectScreen}
      />
      <RootStack.Screen name="AlreadyOnProj" component={AlreadyOnProj} />
      <RootStack.Screen name="BGMapsSettings" component={BGMapsSettings} />
      <RootStack.Screen name="BackgroundMaps" component={BackgroundMaps} />
      <RootStack.Screen name="CategoryChooser" component={CategoryChooser} />
      <RootStack.Screen
        name="ConfirmLeavePracticeModeScreen"
        component={ConfirmLeavePracticeModeScreen}
      />
      <RootStack.Screen
        name="ConnectingToDeviceScreen"
        component={ConnectingToDeviceScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="CoordinateFormat" component={CoordinateFormat} />
      <RootStack.Screen
        name="CreateProjectScreen"
        component={CreateProjectScreen}
      />
      <RootStack.Screen name="DirectionalArrow" component={DirectionalArrow} />
      <RootStack.Screen name="Experiments" component={Experiments} />
      <RootStack.Screen name="GpsModal" component={GpsModal} />
      <RootStack.Screen name="LanguageSettings" component={LanguageSettings} />
      <RootStack.Screen
        name="LeaveProjectScreen"
        component={LeaveProjectScreen}
      />
      <RootStack.Screen name="ManualGpsScreen" component={ManualGpsScreen} />
      <RootStack.Screen name="MapSettings" component={MapSettings} />
      <RootStack.Screen name="Observation" component={Observation} />
      <RootStack.Screen
        name="ObservationDetails"
        component={ObservationDetails}
      />
      <RootStack.Screen name="ObservationEdit" component={ObservationEdit} />
      <RootStack.Screen name="ObservationList" component={ObservationList} />
      <RootStack.Screen name="OfflineAreas" component={OfflineAreas} />
      <RootStack.Screen name="P2pUpgrade" component={P2pUpgrade} />
      <RootStack.Screen
        name="PhotosModal"
        component={PhotosModal}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="ProjectConfig" component={ProjectConfig} />
      <RootStack.Screen name="Security" component={Security} />
      <RootStack.Screen name="Settings" component={Settings} />
      <RootStack.Screen name="SyncModal" component={SyncModal} />
      <RootStack.Screen
        name="UnableToLinkScreen"
        component={UnableToLinkScreen}
      />
    </RootStack.Group>
    {devExperiments.onboarding && (
      <RootStack.Group>
        <RootStack.Screen
          name="CreateOrJoinScreen"
          component={CreateOrJoinScreen}
        />
        <RootStack.Screen
          name="SendJoinRequestScreen"
          component={SendJoinRequestScreen}
        />
        <RootStack.Screen
          name="SyncOnboardingScreen"
          component={SyncOnboardingScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="JoinProjectQrScreen"
          component={JoinProjectQrScreen}
        />
        {/* Modal Screen */}
        <RootStack.Screen
          name="ProjectInviteModal"
          component={ProjectInviteModal}
          options={MODAL_NAVIGATION_OPTIONS}
        />
        {/* Modal Screen */}
        <RootStack.Screen
          name="JoinRequestModal"
          component={JoinRequestModal}
          options={MODAL_NAVIGATION_OPTIONS}
        />
      </RootStack.Group>
    )}
    {devExperiments.appPasscode && (
      <RootStack.Group>
        <RootStack.Screen name="NewPasscode" component={NewPasscode} />
        <RootStack.Screen name="AppPasscode" component={AppPasscode} />
      </RootStack.Group>
    )}
  </RootStack.Navigator>
);
