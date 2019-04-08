import {
  createStackNavigator,
  createAppContainer,
  StackViewTransitionConfigs
} from "react-navigation";
import HomeScreen from "./HomeScreen";
import ObservationListScreen from "./ObservationListScreen";
import ObservationDetailScreen from "./ObservationDetailScreen";
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
    }
  },
  {
    initialRouteName: "Home",
    gesturesEnabled: true,
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
  }
);

export default createAppContainer(AppNavigator);
