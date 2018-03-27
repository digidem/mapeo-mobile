// @flow
import { StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import Categories from '../Views/Categories';
import Position from '../Views/Position';
import ObservationEditor from '../Views/ObservationEditor';
import CameraView from '../Views/CameraView';
import PhotoView from '../Views/PhotoView';
import ObservationDetailView from '../Views/ObservationDetailView';
import PreferencesView from '../Views/PreferencesView/PreferencesView';
import TabBarNavigation from '../Views/TabBarView';

const routeConfiguration = {
  Categories: { screen: Categories },
  Position: { screen: Position },
  ObservationEditor: { screen: ObservationEditor },
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
      if (sceneProps.scene.route.routeName.match('Categories')) {
        return CardStackStyleInterpolator.forVertical(sceneProps);
      }

      return CardStackStyleInterpolator.forHorizontal(sceneProps);
    }
  })
};

const MainStackNavigation = StackNavigator(
  routeConfiguration,
  stackConfiguration
);

export default MainStackNavigation;
