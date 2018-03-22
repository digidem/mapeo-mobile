// @flow
import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Text
} from 'react-native';
import Drawer from 'react-native-drawer';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import MyObservationsView from '../../Views/MyObservationsView';
import TabBar from './TabBar';
import { WHITE, MAPEO_BLUE } from '../../../lib/styles';

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

type State = {
  loading: boolean
};

class TabBarNavigation extends React.Component<StateProps, State> {
  static router = TabBar.router;
  state = {
    loading: true
  };

  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ loading: false }), 2000);
  }

  timeout: any;
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
    const { loading } = this.state;

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
            justifyContent: 'center',
            alignItems: 'center',
            height: 60,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 5
          }}
        >
          <View
            style={{
              height: 35,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, .8)',
              borderRadius: 50,
              paddingLeft: loading ? 7 : 13,
              paddingRight: 15
            }}
          >
            {loading && (
              <ActivityIndicator
                style={{ height: 30, width: 30 }}
                color={MAPEO_BLUE}
              />
            )}
            {loading && (
              <Text style={{ color: WHITE, marginLeft: 5 }}>
                GPS: Loading...
              </Text>
            )}
            {!loading && (
              <View
                style={{
                  backgroundColor: '#7AFA4C',
                  height: 10,
                  width: 10,
                  borderRadius: 50
                }}
              />
            )}
            {!loading && (
              <Text style={{ color: WHITE, marginLeft: 10 }}>GPS: Strong</Text>
            )}
          </View>
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
