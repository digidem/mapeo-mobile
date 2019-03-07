import {
  createStackNavigator,
  createAppContainer,
  StackViewTransitionConfigs
} from "react-navigation";
import HomeScreen from "./HomeScreen";
import ObservationListScreen from "./ObservationListScreen";
const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    ObservationList: {
      screen: ObservationListScreen,
      path: "observations",
      navigationOptions: {
        title: "Observations"
      }
    }
  },
  {
    initialRouteName: "Home",
    gesturesEnabled: true,
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
  }
);

export default createAppContainer(AppNavigator);
