// @flow
import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  SectionList,
  Dimensions
} from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import LeftChevron from 'react-native-vector-icons/Entypo';
import { map } from 'lodash';
import I18n from 'react-native-i18n';
import type { Observation } from '../../../types/observation';

import { LIGHT_GREY, WHITE } from '../../../lib/styles';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  header: {
    fontSize: 20,
    textAlign: 'left',
    paddingVertical: 20,
    fontWeight: '700',
    color: 'black',
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width - 40,
    paddingHorizontal: 30
  },
  closeDrawerButton: {
    backgroundColor: '#333333',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftChevron: {
    alignSelf: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }]
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

const ObservationsView = (props: StateProps & Props & DispatchProps) => {
  const { observations } = props;
  const sectionMappings = {};
  let label;
  const esLocale = require('moment/locale/es');
  if (I18n.currentLocale() === 'es') moment.locale('es', esLocale);

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

    if (!sectionMappings[label]) {
      sectionMappings[label] = [];
    }

    sectionMappings[label].push(o);
  });
  const sections = map(sectionMappings, (data, title) => ({
    title,
    data
  }));
  const keyExtractor = item => item.id;
  const handleItemPress = item => {
    props.selectObservation(item);
    props.goToObservationDetail();
  };

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: WHITE }}>
      <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
        <TouchableOpacity
          onPress={props.closeRightDrawer}
          style={styles.closeDrawerButton}
        >
          <LeftChevron
            color={WHITE}
            name="chevron-left"
            size={30}
            style={styles.leftChevron}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>{I18n.t('observations.title')}</Text>
        <SectionList
          style={{ flex: 1, flexDirection: 'column' }}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <ObservationCell
              navigation={props.navigation}
              observation={item}
              onPress={handleItemPress}
            />
          )}
          renderSectionHeader={({ section }) => (
            <ObservationHeader title={section.title} key={section.title} />
          )}
          sections={sections}
        />
      </View>
    </View>
  );
};

export default withNavigation(ObservationsView);
