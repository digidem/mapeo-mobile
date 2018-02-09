// @flow
import { StackNavigator } from 'react-navigation';

import NewObservationView from '@src/components/Views/NewObservationView/NewObservationView';
import TabBarNavigation from '@src/components/Views/TabBarView';
import MyObservationsView from '@src/components/Views/MyObservationsView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';

const routeConfiguration = {
  TabBarNavigation: { screen: TabBarNavigation },
  NewObservationView: { screen: NewObservationView },
  MyObservationsView: { screen: MyObservationsView },
  PreferencesView: { screen: PreferencesView },
};
const stackConfiguration = {
  initialRouteName: 'TabBarNavigation',
  headerMode: 'none',
};

const MainStackNavigation = StackNavigator(routeConfiguration, stackConfiguration);

export default MainStackNavigation;
