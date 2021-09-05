import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import HomeHeader from "../sharedComponents/HomeHeader";
import { LeaveProjectScreen } from "../screens/LeaveProject/LeaveProject";
import { LeaveProjectProgress } from "../screens/LeaveProject/LeaveProjectProgess";
import { LeaveProjectCompleted } from "../screens/LeaveProject/LeaveProjectCompleted";
import { AlreadyOnProj } from "../screens/AlreadyOnProject";
import HomeTabComponent from "./HomeTabs";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
} from "../screens/Onboarding";
import ProjectInviteModal from "../screens/ProjectInviteModal";

export type AppStackNavTypes = {
  Home: undefined;
  GpsModal: undefined;
  SyncModal: undefined;
  Settings: undefined;
  ProjectConfig: undefined;
  AboutMapeo: undefined;
  LanguageSettings: undefined;
  CoordinateFormat: undefined;
  PhotosModal: undefined;
  CategoryChooser: undefined;
  AddPhoto: undefined;
  ObservationList: undefined;
  Observation: undefined;
  ObservationEdit: undefined;
  ManualGpsScreen: undefined;
  ObservationDetails: undefined;
  LeaveProjectScreen: undefined;
  LeaveProjectProgress: undefined;
  LeaveProjectCompleted: undefined;
  AlreadyOnProj: undefined;

  //Onboarding Stack
  CreateOrJoinScreen: undefined;
  JoinProjectQr: undefined;
  SendJoinRequest: undefined;

  // Modal Stacks
  ProjectInviteModal: undefined;
};

const Stack = createNativeStackNavigator<AppStackNavTypes>();

export const AppStack = () => {
  const isOnboarding: boolean = process.env.FEATURE_ONBOARDING === "true";

  return (
    <Stack.Navigator
      initialRouteName={isOnboarding ? "CreateOrJoinScreen" : "Home"}
    >
      <Stack.Group
        screenOptions={({ route }) => ({
          presentation: "card",
          // headerLeft:props=><CustomHeaderLeft {...props} />,
          headerShown: route.name !== "Home",
        })}
        // screenOptions={{
        //   presentation: "card",
        //   headerMode: "screen",
        //   // We use a slightly larger back icon, to improve accessibility
        //   // TODO iOS: This should probably be a chevron not an arrow
        //   headerStyle: { height: 60 },
        //   headerLeft: props => <CustomHeaderLeft {...props} />,
        //   headerTitleStyle: { marginHorizontal: 0 },
        //   headerShown: route.name !== "Home",
        //   cardStyle: { backgroundColor: "#ffffff" },
        // }}
      >
        {/* {isOnboarding && 
          <React.Fragment>
            <Stack.Screen
              name="CreateOrJoinScreen"
              component={CreateOrJoinScreen}
            />
            <Stack.Screen
              name="JoinProjectQr"
              component={JoinProjectQrScreen}
            />
            <Stack.Screen
              name="SendJoinRequest"
              component={SendJoinRequestScreen}
            />
          </React.Fragment>
        } */}

        <Stack.Screen name="Home" component={HomeTabComponent} />
        <Stack.Screen name="GpsModal" component={GpsModal} />
        <Stack.Screen name="SyncModal" component={SyncModal} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ProjectConfig" component={ProjectConfig} />
        <Stack.Screen name="AboutMapeo" component={AboutMapeo} />
        <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
        <Stack.Screen name="CoordinateFormat" component={CoordinateFormat} />
        <Stack.Screen name="PhotosModal" component={PhotosModal} />
        <Stack.Screen name="CategoryChooser" component={CategoryChooser} />
        <Stack.Screen name="AddPhoto" component={AddPhoto} />
        <Stack.Screen name="ObservationList" component={ObservationList} />
        <Stack.Screen name="Observation" component={Observation} />
        <Stack.Screen name="ObservationEdit" component={ObservationEdit} />
        <Stack.Screen name="ManualGpsScreen" component={ManualGpsScreen} />
        <Stack.Screen
          name="ObservationDetails"
          component={ObservationDetails}
        />
        <Stack.Screen
          name="LeaveProjectScreen"
          component={LeaveProjectScreen}
        />
        <Stack.Screen
          name="LeaveProjectProgress"
          component={LeaveProjectProgress}
        />
        <Stack.Screen
          name="LeaveProjectCompleted"
          component={LeaveProjectCompleted}
        />
        <Stack.Screen name="AlreadyOnProj" component={AlreadyOnProj} />
      </Stack.Group>

      {/* Modals */}
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="ProjectInviteModal"
          component={ProjectInviteModal}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
