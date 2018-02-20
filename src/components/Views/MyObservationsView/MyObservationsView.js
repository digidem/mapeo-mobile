// @flow
import React from 'react';
import moment from 'moment';
import { Button, Text, View, StyleSheet, SectionList } from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import type { Observation } from '@types/observation';
import { map } from 'lodash';
import ObservationCell from './ObservationCell';
import ObservationHeader from './ObservationHeader';

export type StateProps = {
  observations: Observation[]
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
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '700',
    color: 'black'
  }
});

const MyObservationsView = (props: StateProps & Props) => {
  const { observations } = props;
  const sectionMappings = {};
  let label;
  observations.forEach(o => {
    const createdMoment = moment(o.created);
    const thisWeek = moment().startOf('week');
    const thisMonth = moment().startOf('month');
    const thisYear = moment().startOf('year');
    if (createdMoment.isSameOrAfter(thisWeek)) {
      label = 'This Week';
    } else if (createdMoment.isSameOrAfter(thisMonth)) {
      label = 'This Month';
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Observations</Text>
      <SectionList
        style={{ flex: 1, flexDirection: 'column' }}
        renderItem={({ item }) => (
          <ObservationCell
            navigation={props.navigation}
            observation={item}
            key={item.id}
          />
        )}
        renderSectionHeader={({ section }) => (
          <ObservationHeader title={section.title} />
        )}
        sections={sections}
      />
      <Button onPress={props.closeRightDrawer} title="close" />
    </View>
  );
};

export default withNavigation(MyObservationsView);
