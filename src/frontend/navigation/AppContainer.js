import React from "react";
import { fromBottom } from "react-navigation-transitions";
import {
  createStackNavigator,
  createAppContainer,
  StackViewTransitionConfigs
} from "react-navigation";
import HomeScreen from "./HomeScreen";
import ObservationListScreen from "./ObservationListScreen";
import ObservationDetailScreen from "./ObservationDetailScreen";
import ObservationEditScreen from "./ObservationEditScreen";
import CategoriesScreen from "./CategoriesScreen";
import GpsModalScreen from "./GpsModalScreen";
import IconButton from "../components/IconButton";
import BackIcon from "../components/icons/BackIcon";

const HeaderLeft = ({ onPress }) => (
  <IconButton onPress={onPress}>
    <BackIcon />
  </IconButton>
);

const defaultNavigationOptions = {
  headerStyle: {
    height: 60
  },
  headerLeft: React.memo(HeaderLeft)
};

const EditStack = createStackNavigator(
  {
    ObservationEdit: {
      screen: ObservationEditScreen
    },
    CategoryChooser: {
      screen: CategoriesScreen
    }
  },
  {
    initialRouteName: "ObservationEdit",
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    defaultNavigationOptions
  }
);

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    ObservationList: {
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

const FROM_BOTTOM_MODALS = ["NewObservation"];

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack
    },
    NewObservation: {
      screen: EditStack
    },
    GpsModal: {
      screen: GpsModalScreen
    }
  },
  {
    initialRouteName: "Main",
    mode: "modal",
    headerMode: "none",
    transitionConfig: (props, prevProps) => {
      // Modals in this array will slide up from the bottom of the screen
      if (FROM_BOTTOM_MODALS.some(matchRoute(props, prevProps))) {
        return fromBottom();
      } else {
        return StackViewTransitionConfigs.getTransitionConfig();
      }
    },
    defaultNavigationOptions: {
      headerLeft: HeaderLeft
    }
  }
);

export default createAppContainer(RootStack);

function matchRoute(props, prevProps) {
  return function(screenName) {
    return (
      screenName === props.scene.route.routeName ||
      (prevProps && screenName === prevProps.scene.route.routeName)
    );
  };
}
