// @flow
import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import Drawer from 'react-native-drawer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import PreferencesView from '@src/components/Views/PreferencesView/PreferencesView';
import MyObservationsView from '@src/components/Views/MyObservationsView';

import ProfileImg from 'react-native-vector-icons/FontAwesome';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';

import TabBar from './TabBar';

const styles = StyleSheet.create({
  myObservationsIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
  },

  profileIcon: {
    position: 'absolute',
    left: 20,
    top: 15,
  },
});

export type StateProps = {
  navigationState: any,
  dispatch: any,
};

class TabBarNavigation extends React.Component<StateProps> {
  static router = TabBar.router;
  leftDrawer: Drawer;
  rightDrawer: Drawer;

  closeLeftDrawer = () => {
    this.leftDrawer.close();
  };

  openLeftDrawer = () => {
    this.leftDrawer.open();
  };

  closeRightDrawer = () => {
    this.rightDrawer.close();
  };

  openRightDrawer = () => {
    this.rightDrawer.open();
  };

  handleLeftDrawerRef = (ref: Drawer) => {
    this.leftDrawer = ref;
  };

  handleRightDrawerRef = (ref: Drawer) => {
    this.rightDrawer = ref;
  };

  render() {
    const { dispatch, navigationState } = this.props;

    return (
      <Drawer
        ref={this.handleLeftDrawerRef}
        content={<PreferencesView closeLeftDrawer={this.closeLeftDrawer} />}
        openDrawerOffset={0}
        type="displace"
      >
        <Drawer
          ref={this.handleRightDrawerRef}
          content={
            <MyObservationsView closeRightDrawer={this.closeRightDrawer} />
          }
          openDrawerOffset={30}
          side="right"
          type="displace"
        >
          <View style={{ flexDirection: 'row', height: 60 }}>
            <TouchableHighlight
              onPress={this.openLeftDrawer}
              style={styles.profileIcon}
              underlayColor="antiquewhite"
            >
              <ProfileImg color="black" name="user-circle" size={40} />
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.openRightDrawer}
              style={styles.myObservationsIcon}
              underlayColor="antiquewhite"
            >
              <CollectionsImg color="black" name="collections" size={40} />
            </TouchableHighlight>
          </View>
          <TabBar
            navigation={addNavigationHelpers({
              dispatch,
              state: navigationState,
              addListener: createReduxBoundAddListener('tabBar'),
            })}
          />
        </Drawer>
      </Drawer>
    );
  }
}

export default TabBarNavigation;
