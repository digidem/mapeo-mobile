// @flow
import React from "react";
import {
  createStackNavigator,
  createAppContainer,
  // $FlowFixMe
  StackViewTransitionConfigs,
  StackActions
} from "react-navigation";
import HomeScreen from "./HomeScreen";
import ObservationListScreen from "./ObservationListScreen";
import ObservationDetailScreen from "./ObservationDetailScreen";
import ObservationEditScreen from "./ObservationEditScreen";
import AddPhotoScreen from "./AddPhotoScreen";
import CategoriesScreen from "./CategoriesScreen";
import GpsModalScreen from "./GpsModalScreen";
import IconButton from "../components/IconButton";
import BackIcon from "../components/icons/BackIcon";
import CloseIcon from "../components/icons/CloseIcon";

const HeaderLeft = ({ onPress }) => (
  <IconButton onPress={onPress}>
    <BackIcon />
  </IconButton>
);

const EditHeaderLeft = ({ navigation }) => {
  const parent = navigation.dangerouslyGetParent();
  const isClose =
    isTopOfStack(navigation) ||
    (navigation.state.routeName === "ObservationEdit" &&
      parent &&
      parent.state.routeName === "NewObservation");
  return (
    <IconButton onPress={() => navigation.pop()}>
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

const EditStack = createStackNavigator(
  {
    ObservationEdit: ObservationEditScreen,
    CategoryChooser: CategoriesScreen,
    AddPhoto: AddPhotoScreen
  },
  {
    initialRouteName: "ObservationEdit",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    defaultNavigationOptions: ({ navigation }) => ({
      ...defaultNavigationOptions,
      headerLeft: <EditHeaderLeft navigation={navigation} />
    })
  }
);

const defaultGetStateForAction = EditStack.router.getStateForAction;

EditStack.router.getStateForAction = (action, state) => {
  let newState = defaultGetStateForAction(action, state);
  // This is a hack that pops the ObservationEdit screen to the top of the stack
  // when in the NewObservation stack. This is so that after selecting a
  // category then the back button cancels the new observation, and when you
  // subsequently change the category, then the screen enters from the
  // right-hand-side
  if (
    state &&
    !state.isTransitioning &&
    newState &&
    newState.routeName === "NewObservation" &&
    action &&
    action.type === StackActions.COMPLETE_TRANSITION &&
    newState.index === 1 &&
    newState.routes &&
    newState.routes[1].routeName === "ObservationEdit"
  ) {
    newState = {
      ...newState,
      index: 0,
      routes: [newState.routes[1]]
    };
  }
  return newState;
};

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    ObservationList: {
      // $FlowFixMe
      screen: ObservationListScreen,
      path: "observations"
    },
    ObservationDetail: {
      screen: ObservationDetailScreen,
      path: "observations/:observationId"
    },
    ObservationEdit: {
      screen: EditStack,
      path: "observations/:observationId/edit"
    }
  },
  {
    initialRouteName: "Home",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    defaultNavigationOptions
  }
);

const RootStack = createStackNavigator(
  {
    Main: MainStack,
    NewObservation: EditStack,
    GpsModal: GpsModalScreen
  },
  {
    initialRouteName: "Main",
    mode: "modal",
    headerMode: "none",
    defaultNavigationOptions: {
      headerLeft: HeaderLeft
    }
  }
);

// $FlowFixMe
export default createAppContainer(RootStack);

// returns true of the component is top of the stack
function isTopOfStack(navigation) {
  const parent = navigation.dangerouslyGetParent();
  return parent && parent.state && parent.state.index === 0;
}
