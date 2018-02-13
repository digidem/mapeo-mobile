// @flow
import { StackNavigator } from 'react-navigation';

import NewObservationView from '@src/components/Views/NewObservationView/NewObservationView';
import MyObservationsView from '@src/components/Views/MyObservationsView';
import ObservationDetailView from '@src/components/Views/ObservationDetailView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';
import TabBarNavigation from '@src/components/Views/TabBarView';

const routeConfiguration = {
  NewObservationView: { screen: NewObservationView },
  MyObservationsView: { screen: MyObservationsView },
  ObservationDetailView: { screen: ObservationDetailView },
  PreferencesView: { screen: PreferencesView },
  TabBarNavigation: { screen: TabBarNavigation },
};
const stackConfiguration = {
  initialRouteName: 'TabBarNavigation',
  headerMode: 'none',
};

const MainStackNavigation = StackNavigator(routeConfiguration, stackConfiguration);

export default MainStackNavigation;
