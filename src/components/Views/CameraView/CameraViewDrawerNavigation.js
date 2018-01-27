import { DrawerNavigator } from 'react-navigation';

import MyObservationsView from '@src/components/Views/MyObservationsView/MyObservationsView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';
import CameraView from './CameraView';

const myObservationsDrawerRouteConfiguration = {
  CameraView: {
    screen: CameraView,
  },
};
const myObservationsDrawerNavigatorConfiguration = {
  contentComponent: MyObservationsView,
  drawerPosition: 'right',
  drawerOpenRoute: 'RightDrawerOpen',
};

const MyObservationsDrawer = DrawerNavigator(myObservationsDrawerRouteConfiguration, myObservationsDrawerNavigatorConfiguration);
const CameraViewDrawerNavigation = DrawerNavigator({
  Child: {
    screen: MyObservationsDrawer,
    navigationOptions: ({navigation}) => ({
    }),
  }
}, {
  contentComponent: PreferencesView,
});

export default CameraViewDrawerNavigation;