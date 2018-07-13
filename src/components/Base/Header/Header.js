// @flow
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import I18n from 'react-native-i18n';
import roundTo from 'round-to'
import {
  PERMISSION_DENIED,
  UNAVAILABLE,
  SEARCHING,
  LOW_ACCURACY,
  HIGH_ACCURACY
} from '../../../ducks/gps';
import { GREEN, WHITE, MAPEO_BLUE } from '../../../lib/styles';
import type { GPSState } from '../../../types/gps';

interface Props {
  leftIcon: any;
  rightIcon: any;
  style?: any;
  showTriangle?: boolean;
}

export interface StateProps {
  gps: GPSState;
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

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class Header extends React.PureComponent<Props & StateProps> {
  render() {
    const { leftIcon, rightIcon, style, showTriangle, gps } = this.props;

    let title;
    let gpsFailed = false;
    switch (gps.status) {
      case PERMISSION_DENIED:
      case UNAVAILABLE:
        title = I18n.t('gps.off');
        gpsFailed = true
        break;
      case SEARCHING:
        title = I18n.t('gps.loading');
        break;
      case LOW_ACCURACY:
      case HIGH_ACCURACY:
        title = `± ${roundTo(gps.coords.accuracy, 2)}m`;
        break;
      default:
        title = '';
    }

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
            {gps.status === SEARCHING
            ? <ActivityIndicator />
            : (<View
              style={{
                backgroundColor:
                  gpsFailed
                    ? 'lightgrey'
                    : GREEN,
                height: 10,
                width: 10,
                borderRadius: 50
              }}
            />)
            }
            <Text style={{ color: WHITE, marginHorizontal: 20 }}>{title}</Text>
          </View>
          {showTriangle && <View style={styles.triangle} />}
        </View>
        {rightIcon}
      </View>
    );
  }
}

export default Header;
