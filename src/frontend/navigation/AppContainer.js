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
  if (
    isTopOfStack(navigation) ||
    navigation.state.routeName === "ObservationEdit"
  ) {
    return (
      <IconButton onPress={() => navigation.navigate("Main")}>
        <CloseIcon />
      </IconButton>
    );
  } else {
    return (
      <IconButton onPress={() => navigation.pop()}>
        <BackIcon />
      </IconButton>
    );
  }
};

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
    },
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
    defaultNavigationOptions: {
      headerLeft: HeaderLeft
    }
  }
);

export default createAppContainer(RootStack);

// returns true of the component is top of the stack
function isTopOfStack(navigation) {
  const parent = navigation.dangerouslyGetParent();
  return parent && parent.state && parent.state.index === 0;
}
