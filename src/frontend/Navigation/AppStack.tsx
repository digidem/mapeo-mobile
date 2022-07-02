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
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
  SyncOnboardingScreen,
} from "../screens/Onboarding";
import { ProjectInviteModal } from "../screens/ProjectInviteModal";
import { JoinRequestModal } from "../screens/JoinRequestModal";

export type StackNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<AppStackList>,
  BottomTabNavigationProp<HomeTabsList>
>;

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
    editing?: true;
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
  JoinProjectQrScreen: { isAdmin: boolean };
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
  CreateOrJoinScreen: undefined;
  SendJoinRequestScreen: undefined;
  SyncOnboardingScreen: { keepExistingObservations: boolean };
  ProjectInviteModal: { inviteKey: string };
  JoinRequestModal: { deviceName?: string; key?: string } | undefined;
};

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
      tabBarTestID: "tabBarButton" + route.name,
    })}
    initialRouteName="Map"
    backBehavior="initialRoute"
  >
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
  </Tab.Navigator>
);

//tabBarTestID: "tabBarButton" + navigation.state.routeName,

const Stack = createNativeStackNavigator<AppStackList>();

export const AppStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={route => ({
      presentation: "card",
      headerStyle: { backgroundColor: "#ffffff" },
      headerShown: route.route.name !== "Home",
      headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
      // This is for the default back button. We render a custom one in headerLeft, so this one should always be hidden.
      // This **might** cause a problem for IOS
      headerBackVisible: false,
    })}
  >
    <Stack.Group>
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
      <Stack.Screen
        name="CreateProjectScreen"
        component={CreateProjectScreen}
      />
      <Stack.Screen name="DirectionalArrow" component={DirectionalArrow} />
      <Stack.Screen name="Experiments" component={Experiments} />
      <Stack.Screen name="GpsModal" component={GpsModal} />
      <Stack.Screen
        name="JoinProjectQrScreen"
        component={JoinProjectQrScreen}
      />
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
    </Stack.Group>
    {devExperiments.onboarding && (
      <Stack.Group>
        <Stack.Screen
          name="CreateOrJoinScreen"
          component={CreateOrJoinScreen}
        />
        <Stack.Screen
          name="SendJoinRequestScreen"
          component={SendJoinRequestScreen}
        />
        <Stack.Screen
          name="SyncOnboardingScreen"
          component={SyncOnboardingScreen}
        />
        {/* Modal Screen */}
        <Stack.Screen
          name="ProjectInviteModal"
          component={ProjectInviteModal}
          options={{ presentation: "transparentModal" }}
        />
        {/* Modal Screen */}
        <Stack.Screen
          name="JoinRequestModal"
          component={JoinRequestModal}
          options={{ presentation: "transparentModal" }}
        />
      </Stack.Group>
    )}
  </Stack.Navigator>
);
