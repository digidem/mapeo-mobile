import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import * as React from "react";
import { MessageDescriptor } from "react-intl";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { GPS_MODAL_TEXT, WHITE, SYNC_BACKGROUND } from "../../lib/styles";
import AddPhoto from "../../screens/AddPhoto";
import { AddToProjectScreen } from "../../screens/AddToProjectScreen";
import { AlreadyOnProj } from "../../screens/AlreadyOnProject";
import CameraScreen from "../../screens/CameraScreen";
import CategoryChooser from "../../screens/CategoryChooser";
import { ConfirmLeavePracticeModeScreen } from "../../screens/ConfirmLeavePracticeModeScreen";
import { ConnectingToDeviceScreen } from "../../screens/ConnectingToDeviceScreen";
import { CreateProjectScreen } from "../../screens/CreateProject";
import GpsModal from "../../screens/GpsModal";
import { LeaveProjectScreen } from "../../screens/LeaveProject";
import ManualGpsScreen from "../../screens/ManualGpsScreen";
import { MapScreen } from "../../screens/MapScreen/MapScreen";
import Observation from "../../screens/Observation";
import ObservationDetails from "../../screens/ObservationDetails";
import ObservationEdit from "../../screens/ObservationEdit";
import ObservationList, {
  SettingsButton,
} from "../../screens/ObservationsList";

import PhotosModal from "../../screens/PhotosModal";
import { Security } from "../../screens/Security";
import Settings from "../../screens/Settings";
import AboutMapeo from "../../screens/Settings/AboutMapeo";
import CoordinateFormat from "../../screens/Settings/CoordinateFormat";
import Experiments from "../../screens/Settings/Experiments";
import { BGMapsSettings } from "../../screens/Settings/Experiments/BGMaps";
import { DirectionalArrow } from "../../screens/Settings/Experiments/DirectionalArrow";
import { P2pUpgrade } from "../../screens/Settings/Experiments/P2pUpgrade";
import LanguageSettings from "../../screens/Settings/LanguageSettings";
import { MapSettings } from "../../screens/Settings/MapSettings";
import { BackgroundMaps } from "../../screens/Settings/MapSettings/BackgroundMaps";
import { OfflineAreas } from "../../screens/Settings/MapSettings/OfflineAreas";
import { ProjectConfig } from "../../screens/Settings/ProjectConfig";
import SyncModal from "../../screens/SyncModal";
import { UnableToLinkScreen } from "../../screens/UnableToLink";
import CustomHeaderLeft from "../../sharedComponents/CustomHeaderLeft";
import HomeHeader from "../../sharedComponents/HomeHeader";
import { AuthScreen } from "../../screens/AuthScreen";
import { RootStack } from "../AppStack";

export type HomeTabsList = {
  Map: undefined;
  Camera: undefined;
};

export type AppList = {
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
  DirectionalArrow: undefined;
  P2pUpgrade: undefined;
  MapSettings: undefined;
  BackgroundMaps: undefined;
  OfflineAreas: { mapId: string };
  BGMapsSettings: undefined;
  AuthScreen: undefined;
};

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
      name="AuthScreen"
      component={AuthScreen}
      options={{ headerShown: false }}
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
