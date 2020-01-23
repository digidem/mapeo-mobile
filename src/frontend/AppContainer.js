// @flow
import React from "react";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from "react-navigation";

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

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const HomeTabs = createBottomTabNavigator(
  {
    Map: MapScreen,
    Camera: CameraScreen
  },
  // $FlowFixMe
  {
    navigationOptions: () => ({
      header: null
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      initialRouteName: "Map",
      backBehavior: "initialRoute",
      tabBarOptions: {
        showLabel: false
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Map") iconName = "map";
        else iconName = "photo-camera";
        return <MaterialIcons name={iconName} size={30} color={tintColor} />;
      }
    })
  }
);

const RootStack = createStackNavigator(
  // $FlowFixMe - flow definitions don't recognize static props on function components
  {
    Home: HomeTabs,
    GpsModal: GpsModal,
    SyncModal: SyncModal,
    Settings: Settings,
    PhotosModal: PhotosModal,
    CategoryChooser: CategoryChooser,
    AddPhoto: AddPhoto,
    ObservationList: ObservationList,
    Observation: Observation,
    ObservationEdit: ObservationEdit,
    ManualGpsScreen: ManualGpsScreen,
    ObservationDetails: ObservationDetails
  },
  {
    initialRouteName: "Home",
    // TODO iOS: Dynamically set transition mode to modal for modals
    mode: "card",
    headerMode: "screen",
    defaultNavigationOptions: {
      headerStyle: {
        height: 60
      },
      // We use a slightly larger back icon, to improve accessibility
      // TODO iOS: This should probably be a chevron not an arrow
      headerLeft: CustomHeaderLeft,
      headerTitleStyle: {
        marginHorizontal: 0
      }
    }
  }
);

// $FlowFixMe
export default createAppContainer(RootStack);
