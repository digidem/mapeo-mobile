// @flow
import React from 'react';
import moment from 'moment';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import type { Observation } from '../../../types/observation';
import { LIGHT_GREY } from '../../../lib/styles';

type Props = {
  observation: Observation,
  onPress: (i: Observation) => void
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width - 40,
    paddingHorizontal: 30
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '700',
    color: 'black'
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: 'red',
    shadowRadius: 10,
    shadowOpacity: 1
  },
  innerCircle: {
    width: 40,
    height: 40,
    backgroundColor: LIGHT_GREY,
    borderRadius: 50
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  },
  media: {
    width: 60,
    height: 60,
    borderRadius: 7
  }
});

const ObservationCell = (props: Props) => {
  const dateString = moment(props.observation.created).calendar(null, {
    sameDay: '[Today], h:mm A',
    nextDay: '[Tomorrow], h:mm A',
    nextWeek: 'ddd, h:mm A',
    lastDay: '[Yesterday], h:mm A',
    lastWeek: '[Last] ddd, h:mm A',
    sameElse: 'MMM D YYYY, h:mm A'
  });
  const handlePress = () => {
    props.onPress(props.observation);
  };

  return (
    <TouchableHighlight onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.circle}>
          <View style={styles.innerCircle}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 7
              }}
            >
              {props.observation.icon}
            </View>
          
          </View>
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{props.observation.name}</Text>
          <Text>{dateString}</Text>
        </View>
        {props.observation &&
          !!props.observation.media.length && (
            <Image
              source={{ uri: props.observation.media[0].source }}
              style={styles.media}
            />
          )}
      </View>
    </TouchableHighlight>
  );
};

export default ObservationCell;
