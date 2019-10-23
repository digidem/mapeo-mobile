// @flow
import React from "react";
import { Alert } from "react-native";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  // $FlowFixMe
  StackViewTransitionConfigs
} from "react-navigation";
import { defineMessages, useIntl } from "react-intl";

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
import PhotosModal from "./screens/PhotosModal";
import ManualGpsScreen from "./screens/ManualGpsScreen";
import IconButton from "./sharedComponents/IconButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BackIcon, CloseIcon } from "./sharedComponents/icons";
import type { NavigationProp } from "./types";

const m = defineMessages({
  discardTitle: {
    id: "AppContainer.EditHeader.discardTitle",
    defaultMessage: "Discard observation?",
    description:
      "Title of dialog that shows when closing an observation without saving"
  },
  discardConfirm: {
    id: "AppContainer.EditHeader.discardContent",
    defaultMessage: "Discard without saving",
    description: "Button on dialog to close without saving"
  },
  discardCancel: {
    id: "AppContainer.EditHeader.discardCancel",
    defaultMessage: "Continue editing",
    description: "Button on dialog to keep editing (cancelling close action)"
  }
});

type Props = {
  navigation: NavigationProp
};

const HeaderLeft = ({ navigation }: Props) => (
  <IconButton onPress={() => navigation.pop()}>
    <BackIcon />
  </IconButton>
);

const EditHeaderLeft = ({ navigation }: Props) => {
  const { formatMessage: t } = useIntl();
  const parent = navigation.dangerouslyGetParent();
  const isClose =
    (isTopOfStack(navigation) ||
      navigation.state.routeName === "ObservationEdit") &&
    parent &&
    // $FlowFixMe
    parent.state.routeName === "NewObservation";

  const handleCloseRequest = () => {
    Alert.alert(t(m.discardTitle), undefined, [
      {
        text: t(m.discardConfirm),
        onPress: () => navigation.navigate("Home")
      },
      {
        text: t(m.discardCancel),
        onPress: () => {}
      }
    ]);
  };

  return (
    <IconButton
      onPress={() => (isClose ? handleCloseRequest() : navigation.pop())}>
      {isClose ? <CloseIcon /> : <BackIcon />}
    </IconButton>
  );
};

const defaultNavigationOptions = {
  headerStyle: {
    height: 60
  },
  headerLeft: React.memo(HeaderLeft),
  headerTitleStyle: {
    marginHorizontal: 0
  }
};

const ObservationsStack = createStackNavigator(
  {
    // $FlowFixMe - flow definitions don't recognize static props on function components
    CategoryChooser: CategoryChooser,
    // $FlowFixMe - flow definitions don't recognize static props on function components
    AddPhoto: AddPhoto,
    ObservationList: {
      // $FlowFixMe - flow definitions don't recognize static props on function components
      screen: ObservationList,
      path: "observations"
    },
    Observation: {
      // $FlowFixMe - flow definitions don't recognize static props on function components
      screen: Observation,
      path: "observations/:observationId"
    },
    ObservationEdit: {
      screen: ObservationEdit,
      path: "observations/:observationId/edit"
    },
    ManualGpsScreen: ManualGpsScreen,
    ObservationDetails: ObservationDetails
  },
  {
    initialRouteName: "ObservationList",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    defaultNavigationOptions: ({ navigation }) => {
      const parent = navigation.dangerouslyGetParent();
      const inNewStack = parent && parent.state.routeName === "NewObservation";
      return {
        ...defaultNavigationOptions,
        headerLeft: inNewStack ? (
          <EditHeaderLeft navigation={navigation} />
        ) : (
          <HeaderLeft navigation={navigation} />
        )
      };
    }
  }
);

// const defaultGetStateForAction = EditStack.router.getStateForAction;

// EditStack.router.getStateForAction = (action, state) => {
//   let newState = defaultGetStateForAction(action, state);
//   // This is a hack that pops the ObservationEdit screen to the top of the stack
//   // when in the NewObservation stack. This is so that after selecting a
//   // category then the back button cancels the new observation, and when you
//   // subsequently change the category, then the screen enters from the
//   // right-hand-side
//   if (
//     state &&
//     !state.isTransitioning &&
//     newState &&
//     newState.routeName === "NewObservation" &&
//     action &&
//     action.type === StackActions.COMPLETE_TRANSITION &&
//     newState.index === 1 &&
//     newState.routes &&
//     newState.routes[1].routeName === "ObservationEdit"
//   ) {
//     newState = {
//       ...newState,
//       index: 0,
//       routes: [newState.routes[1]]
//     };
//   }
//   return newState;
// };

const Home = createBottomTabNavigator(
  {
    Map: MapScreen,
    Camera: CameraScreen
  },
  {
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

const MainStack = createStackNavigator(
  {
    Home: Home,
    Observations: {
      screen: ObservationsStack,
      path: "observations"
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    defaultNavigationOptions
  }
);

const RootStack = createStackNavigator(
  {
    Main: MainStack,
    NewObservation: ObservationsStack,
    GpsModal: GpsModal,
    SyncModal: SyncModal,
    PhotosModal: PhotosModal
  },
  {
    initialRouteName: "Main",
    mode: "modal",
    headerMode: "none"
  }
);

// $FlowFixMe
export default createAppContainer(RootStack);

// returns true of the component is top of the stack
function isTopOfStack(navigation) {
  const parent = navigation.dangerouslyGetParent();
  return parent && parent.state && parent.state.index === 0;
}
