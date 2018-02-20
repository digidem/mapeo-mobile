// @flow
import React from 'react';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { Observation } from '@types/observation';

type Props = {
  navigation: NavigationActions,
  observation: Observation,
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: Dimensions.get('window').width - 30,
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '700',
    color: 'black',
  },
  text: {
    width: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: 'red',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  innerCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'gray',
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  media: {
    width: 60,
    height: 60,
    borderRadius: 2,
    backgroundColor: 'blue',
  },
});

const ObservationCell = (props: Props) => {
  const dateString = moment(props.observation.created).calendar(null, {
    sameDay: '[Today], h:mm A',
    nextDay: '[Tomorrow], h:mm A',
    nextWeek: 'ddd, h:mm A',
    lastDay: '[Yesterday], h:mm A',
    lastWeek: '[Last] ddd, h:mm A',
    sameElse: 'MMM D YYYY, h:mm A',
  });

  return (
    <TouchableHighlight
      onPress={() =>
        props.navigation.navigate('ObservationDetailView', {
          id: props.observation.id,
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.circle}>
          <View style={styles.innerCircle} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{props.observation.name}</Text>
          <Text>{dateString}</Text>
        </View>
        <View style={styles.media} />
      </View>
    </TouchableHighlight>
  );
};

export default ObservationCell;
