import {
  createStackNavigator,
  createAppContainer,
  StackViewTransitionConfigs
} from "react-navigation";
import HomeScreen from "./HomeScreen";
import ObservationListScreen from "./ObservationListScreen";
import ObservationDetailScreen from "./ObservationDetailScreen";
import ObservationEditScreen from "./ObservationEditScreen";

const AppNavigator = createStackNavigator(
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
      screen: ObservationEditScreen,
      path: "observations/:observationId/edit"
    }
  },
  {
    initialRouteName: "Home",
    gesturesEnabled: true,
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
  }
);

export default createAppContainer(AppNavigator);
