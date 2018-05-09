// @flow
import { createStackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';

import Categories from '../Views/Categories';
import Position from '../Views/Position';
import ObservationEditor from '../Views/ObservationEditor';
import ObservationFields from '../Views/ObservationFields';
import CameraView from '../Views/CameraView';
import PhotoView from '../Views/PhotoView';
import ObservationDetailView from '../Views/ObservationDetailView';
import PreferencesView from '../Views/PreferencesView/PreferencesView';
import TabBarNavigation from '../Views/TabBarNavigation';

const routeConfiguration = {
  Categories: { screen: Categories },
  Position: { screen: Position },
  ObservationEditor: { screen: ObservationEditor },
  ObservationFields: { screen: ObservationFields },
  CameraView: { screen: CameraView },
  PhotoView: { screen: PhotoView },
  ObservationDetailView: { screen: ObservationDetailView },
  PreferencesView: { screen: PreferencesView },
  TabBarNavigation: { screen: TabBarNavigation }
};
const stackConfiguration = {
  initialRouteName: 'TabBarNavigation',
  headerMode: 'none',
  transitionConfig: () => ({
    screenInterpolator: sceneProps => {
      if (
        sceneProps.scene.route.routeName.match('ObservationDetailView') ||
        sceneProps.scene.route.routeName.match('ObservationFields')
      ) {
        return CardStackStyleInterpolator.forHorizontal(sceneProps);
      }

      return CardStackStyleInterpolator.forFade(sceneProps);
    }
  })
};

const MainStackNavigation = createStackNavigator(
  routeConfiguration,
  stackConfiguration
);

export default MainStackNavigation;
