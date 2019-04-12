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
    gesturesEnabled: true,
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
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
    gesturesEnabled: true,
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
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
    navigationOptions: {
      gesturesEnabled: true
    }
  }
);

export default createAppContainer(RootStack);
