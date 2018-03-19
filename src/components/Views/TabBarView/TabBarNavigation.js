// @flow
import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import Drawer from 'react-native-drawer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import MyObservationsView from '../../Views/MyObservationsView';
import TabBar from './TabBar';
import { WHITE } from '../../../lib/styles';

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
  rightDrawer: Drawer;

  closeRightDrawer = () => {
    this.rightDrawer.close();
  };

  openRightDrawer = () => {
    this.rightDrawer.open();
  };

  handleRightDrawerRef = (ref: Drawer) => {
    this.rightDrawer = ref;
  };

  render() {
    const { dispatch, navigationState } = this.props;

    return (
      <Drawer
        ref={this.handleRightDrawerRef}
        content={
          <MyObservationsView closeRightDrawer={this.closeRightDrawer} />
        }
        openDrawerOffset={0}
        side="right"
        type="displace"
      >
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 5
          }}
        >
          <TouchableHighlight
            onPress={this.openRightDrawer}
            style={styles.myObservationsIcon}
            underlayColor="transparent"
          >
            <CollectionsImg color={WHITE} name="collections" size={40} />
          </TouchableHighlight>
        </View>
        <TabBar
          navigation={addNavigationHelpers({
            dispatch,
            state: navigationState,
            addListener: createReduxBoundAddListener('tabBar')
          })}
        />
      </Drawer>
    );
  }
}

export default TabBarNavigation;
