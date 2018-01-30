import { DrawerNavigator } from 'react-navigation';

import MyObservationsView from '@src/components/Views/MyObservationsView/MyObservationsView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';
import MapView from '@src/components/Views/MapView/MapView';

const myObservationsDrawerRouteConfiguration = {
  MapView: {
    screen: MapView,
  },
};
const myObservationsDrawerNavigatorConfiguration = {
  contentComponent: MyObservationsView,
  drawerPosition: 'right',
  drawerOpenRoute: 'RightDrawerOpen',
};

const MyObservationsDrawer = DrawerNavigator(myObservationsDrawerRouteConfiguration, myObservationsDrawerNavigatorConfiguration);
const MapViewDrawerNavigation = DrawerNavigator({
  Child: {
    screen: MyObservationsDrawer,
    navigationOptions: ({navigation}) => ({
    }),
  }
}, {
  contentComponent: PreferencesView,
});

export default MapViewDrawerNavigation;