import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { WHITE, MAPEO_BLUE } from '../../../lib/styles';
import type { Resource } from '../../../types/redux';
import type { GPSState } from '../../../types/gps';

interface Props {
  leftIcon: any;
  rightIcon: any;
  style?: any;
  showTriangle?: boolean;
}

export interface StateProps {
  gps: Resource<GPSState>;
}

interface State {
  loading: boolean;
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15
  },
  gpsPill: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .8)',
    borderRadius: 50,
    paddingRight: 15,
    paddingLeft: 13
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    top: 35,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0, 0, 0, .8)',
    transform: [{ rotate: '180deg' }]
  }
});

class Header extends React.PureComponent<Props & StateProps> {
  render() {
    const { leftIcon, rightIcon, style, showTriangle, gps } = this.props;
    const showLoading = gps.status === 'Pending' || gps.data.accuracy > 100;

    return (
      <View style={[styles.headerBar, style]}>
        {leftIcon}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View style={styles.gpsPill}>
            {showLoading && <ActivityIndicator />}
            {!showLoading && (
              <View
                style={{
                  backgroundColor: '#7AFA4C',
                  height: 10,
                  width: 10,
                  borderRadius: 50
                }}
              />
            )}
            <Text style={{ color: WHITE, marginHorizontal: 20 }}>
              {gps.status === 'Pending'
                ? 'GPS Loading...'
                : `+/-  ${Math.round(gps.data.accuracy)}m`}
            </Text>
          </View>
          {showTriangle && <View style={styles.triangle} />}
        </View>
        {rightIcon}
      </View>
    );
  }
}

export default Header;
