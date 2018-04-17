// @flow
import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import LeftChevron from 'react-native-vector-icons/Feather';
import SyncIcon from 'react-native-vector-icons/FontAwesome';
import SettingsIcon from 'react-native-vector-icons/MaterialIcons';
import { orderBy, map } from 'lodash';
import I18n from 'react-native-i18n';
import type { Observation } from '../../../types/observation';

import {
  LIGHT_GREY,
  MAPEO_BLUE,
  MEDIUM_GREY,
  WHITE
} from '../../../lib/styles';
import ObservationCell from './ObservationCell';
import ObservationHeader from './ObservationHeader';

export type StateProps = {
  observations: Observation[]
};

export type DispatchProps = {
  selectObservation: (o: Observation) => void,
  goToObservationDetail: () => void
};

type Props = {
  closeRightDrawer: Function,
  navigation: NavigationActions
};

type State = {
  showSyncTip: boolean
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  closeDrawerButton: {
    backgroundColor: 'transparent'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 15,
    backgroundColor: 'white'
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f7f7f7',
    borderColor: LIGHT_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  leftChevron: {
    justifyContent: 'center'
  },
  syncButtonInnerCircle: {
    alignSelf: 'center',
    backgroundColor: LIGHT_GREY,
    height: 30,
    width: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  syncButtonOuterCircle: {
    width: 35,
    height: 35,
    backgroundColor: '#d6d2cf',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  syncTipContainer: {
    zIndex: 5,
    position: 'absolute',
    top: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowRadius: 100,
    shadowOpacity: 6,
    shadowOffset: { width: 0, height: 100 },
    elevation: 3
  },
  syncTipInnerContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MAPEO_BLUE,
    borderRadius: 8,
    paddingHorizontal: 5,
    marginTop: 7
  },
  triangle: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: MAPEO_BLUE,
    alignSelf: 'center'
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ObservationsView extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  state = {
    showSyncTip: true
  };
  timeout: any;

  componentWillReceiveProps() {
    this.timeout = setTimeout(
      () =>
        this.setState({
          showSyncTip: false
        }),
      2000
    );
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const { observations } = this.props;
    const sectionMappings = {};
    let label;
    const esLocale = require('moment/locale/es');
    if (I18n.currentLocale() === 'es') moment.locale('es', esLocale);
    else moment.locale('en');

    observations.forEach(o => {
      const createdMoment = moment(o.created);
      const thisWeek = moment().startOf('week');
      const thisMonth = moment().startOf('month');
      const thisYear = moment().startOf('year');
      if (createdMoment.isSameOrAfter(thisWeek)) {
        label = `${I18n.t('observations.this_week')}`;
      } else if (createdMoment.isSameOrAfter(thisMonth)) {
        label = `${I18n.t('observations.this_month')}`;
      } else if (createdMoment.isSameOrAfter(thisYear)) {
        label = createdMoment.format('MMMM');
      } else {
        label = createdMoment.format('MMMM YYYY');
      }
    });

    const sortedObservations = orderBy(observations, ['created'], ['desc']);

    const keyExtractor = item => item.id.toString();
    const handleItemPress = item => {
      this.props.selectObservation(item);
      this.props.goToObservationDetail();
    };

    return (
      <View
        style={{
          flex: 1
        }}
      >
        <FlatList
          scrollEnabled
          ListHeaderComponent={
            <View
              style={{
                flexDirection: 'column'
              }}
            >
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={this.props.closeRightDrawer}
                  style={styles.closeDrawerButton}
                >
                  <LeftChevron color="#a5a5a4" name="chevron-left" size={30} />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'column'
                  }}
                >
                  <TouchableOpacity style={styles.syncButtonOuterCircle}>
                    <View style={styles.syncButtonInnerCircle}>
                      <SyncIcon
                        color={WHITE}
                        name="bolt"
                        size={20}
                        style={{ transform: [{ rotate: '15deg' }] }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                  <SettingsIcon color="#a5a5a4" name="settings" size={30} />
                </TouchableOpacity>
              </View>
              <View style={styles.headerBottom}>
                <Text
                  style={{ fontWeight: '700', fontSize: 12, color: 'black' }}
                >
                  {I18n.t('observations.all_observations')}
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {I18n.t('observations.view_by')}
                </Text>
              </View>
              {this.state.showSyncTip ? (
                <View style={styles.syncTipContainer}>
                  <View style={styles.syncTipInnerContainer}>
                    <Text style={{ color: WHITE, marginHorizontal: 20 }}>
                      {I18n.t('observations.sync')}
                    </Text>
                  </View>
                  <View style={styles.triangle} />
                </View>
              ) : null}
            </View>
          }
          style={{ width: Dimensions.get('window').width }}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <ObservationCell
              currentLocale={I18n.currentLocale()}
              navigation={this.props.navigation}
              observation={item}
              onPress={handleItemPress}
            />
          )}
          data={sortedObservations}
        />
      </View>
    );
  }
}

export default withNavigation(ObservationsView);
