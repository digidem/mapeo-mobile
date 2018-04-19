// @flow
import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Text,
  View,
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
            <ObservationHeader
              closeRightDrawer={this.props.closeRightDrawer}
              showSyncTip={this.state.showSyncTip}
            />
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
