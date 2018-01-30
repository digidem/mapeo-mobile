// @flow
import React from 'react';
import { StackNavigator } from 'react-navigation';
import TabBarNavigation from '@src/components/TabBar/TabBarNavigation';
import NewObservationView from '@src/components/Views/NewObservationView/NewObservationView';

const routeConfiguration = {
  TabBarNavigation: { screen: ({ navigation }) => <TabBarNavigation screenProps={{ rootNavigation: navigation }} /> },
  NewObservationView: { screen: NewObservationView },
};
const stackConfiguration = {
  initialRouteName: 'TabBarNavigation',
  headerMode: 'none',
};

const MainStack = StackNavigator(routeConfiguration, stackConfiguration);

class MainStackNavigation extends React.Component {
  render() {
    return (
      <MainStack />
    );
  }
}

export default MainStackNavigation;