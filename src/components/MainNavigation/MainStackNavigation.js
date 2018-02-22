// @flow
import { StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import Categories from '@src/components/Views/Categories/Categories';
import Position from '@src/components/Views/Position/Position';
import MyObservationsView from '@src/components/Views/MyObservationsView';
import ObservationDetailView from '@src/components/Views/ObservationDetailView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';
import TabBarNavigation from '@src/components/Views/TabBarView';

const routeConfiguration = {
  Categories: { screen: Categories },
  Position: { screen: Position },
  MyObservationsView: { screen: MyObservationsView },
  ObservationDetailView: { screen: ObservationDetailView },
  PreferencesView: { screen: PreferencesView },
  TabBarNavigation: { screen: TabBarNavigation }
};
const stackConfiguration = {
  initialRouteName: 'TabBarNavigation',
  headerMode: 'none',
  transitionConfig: () => ({
    screenInterpolator: sceneProps =>
      CardStackStyleInterpolator.forHorizontal(sceneProps)
  })
};

const MainStackNavigation = StackNavigator(
  routeConfiguration,
  stackConfiguration
);

export default MainStackNavigation;
