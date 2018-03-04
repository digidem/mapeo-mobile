// @flow
import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

import TabBar from './TabBar';

const styles = StyleSheet.create({
  myObservationsIcon: {
    position: 'absolute',
    right: 20,
    top: 15
  },

  profileIcon: {
    position: 'absolute',
    left: 20,
    top: 15
  }
});

export type StateProps = {
  navigationState: any,
  dispatch: any
};

class TabBarNavigation extends React.Component<StateProps> {
  static router = TabBar.router;

  render() {
    const { dispatch, navigationState } = this.props;

    return (
      <TabBar
        navigation={addNavigationHelpers({
          dispatch,
          state: navigationState,
          addListener: createReduxBoundAddListener('tabBar')
        })}
      />
    );
  }
}

export default TabBarNavigation;
