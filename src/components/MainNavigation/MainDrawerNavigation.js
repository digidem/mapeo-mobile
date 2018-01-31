import { Dimensions } from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import MyObservationsView from '@src/components/Views/MyObservationsView/MyObservationsView';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';
import CameraView from '@src/components/Views/CameraView/CameraView';
import TabBarNavigation from '@src/components/Views/TabBarView/TabBarNavigation';

const myObservationsDrawerRouteConfiguration = {
  TabBarNavigation: {
    screen: TabBarNavigation,
  },
};
const myObservationsDrawerNavigatorConfiguration = {
  contentComponent: MyObservationsView,
  drawerPosition: 'right',
  drawerOpenRoute: 'RightDrawerOpen',
  drawerWidth: Dimensions.get('window').width - 40,
};

const MyObservationsDrawer = DrawerNavigator(myObservationsDrawerRouteConfiguration, myObservationsDrawerNavigatorConfiguration);
const MainDrawerNavigation = DrawerNavigator({
  Child: {
    screen: MyObservationsDrawer,
    navigationOptions: ({navigation}) => ({
    }),
  }
}, {
  contentComponent: PreferencesView,
  drawerWidth: Dimensions.get('window').width - 40,
});

export default MainDrawerNavigation;