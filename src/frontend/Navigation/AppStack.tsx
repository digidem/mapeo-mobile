import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { MapScreen } from "../screens/MapScreen/MapScreen";
import CameraScreen from "../screens/CameraScreen";
import ObservationList, { SettingsButton } from "../screens/ObservationsList";
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
import { JoinRequestModal } from "../screens/JoinRequestModal";
import { ProjectInviteModal } from "../screens/ProjectInviteModal";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
  SyncOnboardingScreen,
} from "../screens/Onboarding";
import { MODAL_NAVIGATION_OPTIONS } from "../sharedComponents/BottomSheetModal";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HeaderButtonProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack/lib/typescript/src/types";
import { NavigatorScreenParams } from "@react-navigation/native";
import { IccaStackList } from "../screens/Intro";
import { MessageDescriptor } from "react-intl";
import {
  GPS_MODAL_TEXT,
  MEDIUM_BLUE,
  SYNC_BACKGROUND,
  WHITE,
} from "../lib/styles";
import { ObscurePasscode } from "../screens/ObscurePasscode";
export type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
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
  ObscurePasscode: undefined;
} & OnboardingStackList &
  IccaStackList;

const Tab = createBottomTabNavigator<HomeTabsList>();

export const RootStack = createNativeStackNavigator<AppStackList>();

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

// **NOTE**: No hooks allowed here (this is not a component, it is a function
// that returns a react element)
export const createDefaultScreenGroup = (
  intl: (title: MessageDescriptor) => string
) => (
  <RootStack.Group key="default">
    <RootStack.Screen
      name="Home"
      options={{ headerShown: false }}
      component={HomeTabs}
    />
    <RootStack.Screen
      name="AboutMapeo"
      component={AboutMapeo}
      options={{ headerTitle: intl(AboutMapeo.navTitle) }}
    />
    <RootStack.Screen
      name="AddPhoto"
      component={AddPhoto}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="AddToProjectScreen"
      component={AddToProjectScreen}
      options={{ headerTitle: intl(AddToProjectScreen.navTitle) }}
    />
    {/* Modal, no title */}
    <RootStack.Screen name="AlreadyOnProj" component={AlreadyOnProj} />
    <RootStack.Screen
      name="BGMapsSettings"
      component={BGMapsSettings}
      options={{ headerTitle: intl(BGMapsSettings.navTitle) }}
    />
    {/* Modal, no title */}
    <RootStack.Screen name="BackgroundMaps" component={BackgroundMaps} />
    <RootStack.Screen
      name="CategoryChooser"
      component={CategoryChooser}
      options={{ headerTitle: intl(CategoryChooser.navTitle) }}
    />
    <RootStack.Screen
      name="ConfirmLeavePracticeModeScreen"
      component={ConfirmLeavePracticeModeScreen}
      options={{ headerTitle: intl(ConfirmLeavePracticeModeScreen.navTitle) }}
    />
    <RootStack.Screen
      name="ConnectingToDeviceScreen"
      component={ConnectingToDeviceScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="CoordinateFormat"
      component={CoordinateFormat}
      options={{ headerTitle: intl(CoordinateFormat.navTitle) }}
    />
    <RootStack.Screen
      name="CreateProjectScreen"
      component={CreateProjectScreen}
      options={{ headerTitle: intl(CreateProjectScreen.navTitle) }}
    />
    <RootStack.Screen
      name="DirectionalArrow"
      component={DirectionalArrow}
      options={{ headerTitle: intl(DirectionalArrow.navTitle) }}
    />
    <RootStack.Screen
      name="Experiments"
      component={Experiments}
      options={{ headerTitle: intl(Experiments.navTitle) }}
    />
    <RootStack.Screen
      name="GpsModal"
      component={GpsModal}
      options={{
        headerTitle: intl(GpsModal.navTitle),
        headerStyle: { backgroundColor: GPS_MODAL_TEXT },
        headerTintColor: WHITE,
        headerLeft: props => (
          <CustomHeaderLeft headerBackButtonProps={props} tintColor={WHITE} />
        ),
      }}
    />
    <RootStack.Screen
      name="LanguageSettings"
      component={LanguageSettings}
      options={{ headerTitle: intl(LanguageSettings.navTitle) }}
    />
    <RootStack.Screen
      name="LeaveProjectScreen"
      component={LeaveProjectScreen}
      options={{ headerTitle: intl(LeaveProjectScreen.navTitle) }}
    />
    <RootStack.Screen
      name="ManualGpsScreen"
      component={ManualGpsScreen}
      options={{ headerTitle: intl(ManualGpsScreen.navTitle) }}
    />
    <RootStack.Screen
      name="MapSettings"
      component={MapSettings}
      options={{ headerTitle: intl(MapSettings.navTitle) }}
    />
    <RootStack.Screen
      name="Observation"
      component={Observation}
      options={{ headerTitle: intl(Observation.navTitle) }}
    />

    {/* Header is set in component */}
    <RootStack.Screen
      name="ObservationDetails"
      component={ObservationDetails}
    />
    {/* Header is set in component */}
    <RootStack.Screen name="ObservationEdit" component={ObservationEdit} />
    <RootStack.Screen
      name="ObservationList"
      component={ObservationList}
      options={{
        headerTitle: intl(ObservationList.navTitle),
        headerRight: () => <SettingsButton />,
      }}
    />
    <RootStack.Screen
      name="OfflineAreas"
      component={OfflineAreas}
      options={{ headerTitle: intl(OfflineAreas.navTitle) }}
    />
    <RootStack.Screen
      name="P2pUpgrade"
      component={P2pUpgrade}
      options={{ headerTitle: intl(P2pUpgrade.navTitle) }}
    />
    <RootStack.Screen
      name="PhotosModal"
      component={PhotosModal}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="ProjectConfig"
      component={ProjectConfig}
      options={{ headerTitle: intl(ProjectConfig.navTitle) }}
    />
    <RootStack.Screen
      name="Security"
      component={Security}
      options={{ headerTitle: intl(Security.navTitle) }}
    />
    <RootStack.Screen
      name="Settings"
      component={Settings}
      options={{ headerTitle: intl(Settings.navTitle) }}
    />
    <RootStack.Screen
      name="SyncModal"
      component={SyncModal}
      options={{
        headerTitle: intl(SyncModal.navTitle),
        headerStyle: { backgroundColor: SYNC_BACKGROUND },
        headerTintColor: WHITE,
        headerLeft: props => (
          <CustomHeaderLeft headerBackButtonProps={props} tintColor={WHITE} />
        ),
      }}
    />
    <RootStack.Screen
      name="UnableToLinkScreen"
      component={UnableToLinkScreen}
      options={{ headerTitle: intl(UnableToLinkScreen.navTitle) }}
    />
  </RootStack.Group>
);

// **NOTE**: No hooks allowed here (this is not a component, it is a function
// that returns a react element)
export const createOnboardingScreenGroup = (
  intl: (title: MessageDescriptor) => string
) => (
  <RootStack.Group key="onboarding">
    <RootStack.Screen
      name="CreateOrJoinScreen"
      component={CreateOrJoinScreen}
    />
    <RootStack.Screen
      name="SendJoinRequestScreen"
      component={SendJoinRequestScreen}
      options={{
        headerTitle: intl(SendJoinRequestScreen.navTitle),
        headerStyle: { backgroundColor: MEDIUM_BLUE },
        headerTintColor: WHITE,
        headerLeft: props => (
          <CustomHeaderLeft headerBackButtonProps={props} tintColor={WHITE} />
        ),
      }}
    />
    <RootStack.Screen
      name="SyncOnboardingScreen"
      component={SyncOnboardingScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="JoinProjectQrScreen"
      component={JoinProjectQrScreen}
      options={{
        headerTitle: intl(JoinProjectQrScreen.navTitle),
        headerStyle: { backgroundColor: MEDIUM_BLUE },
        headerTintColor: WHITE,
        headerLeft: props => (
          <CustomHeaderLeft headerBackButtonProps={props} tintColor={WHITE} />
        ),
      }}
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
);

// **NOTE**: No hooks allowed here (this is not a component, it is a function
// that returns a react element)
export const createAppPasscodeScreenGroup = (
  intl: (title: MessageDescriptor) => string
) => (
  <RootStack.Group key="appPasscode">
    <RootStack.Screen
      name="AppPasscode"
      component={AppPasscode}
      options={{ headerTitle: intl(AppPasscode.navTitle) }}
    />
    <RootStack.Screen
      name="ObscurePasscode"
      component={ObscurePasscode}
      options={{ headerTitle: intl(ObscurePasscode.navTitle) }}
    />
  </RootStack.Group>
);
