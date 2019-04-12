import React from "react";
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
    transparentCard: true,
    cardStyle: {
      opacity: 1
    },
    defaultNavigationOptions: {
      headerLeft: HeaderLeft
    }
  }
);

export default createAppContainer(RootStack);
