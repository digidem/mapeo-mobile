// @flow
import React from 'react';
import moment from 'moment';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import I18n from 'react-native-i18n';
import type { Observation } from '../../../types/observation';
import { LIGHT_GREY } from '../../../lib/styles';

export type Props = {
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
  titleLong: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black'
  },
  media: {
    width: 60,
    height: 60,
    borderRadius: 7
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

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
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.circle}>
          <View style={styles.innerCircle}>
            {!!props.observation &&
              !!props.observation.icon && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 7
                  }}
                >
                  {!!props.observation.media.length &&
                    props.observation.media[0].type === 'LocalPhoto' && (
                      <Image
                        source={props.observation.icon}
                        style={{ width: 25, height: 25 }}
                        resizeMode="contain"
                      />
                    )}
                  {(!props.observation.media.length ||
                    props.observation.media[0].type !== 'LocalPhoto') &&
                    !!props.observation.icon && (
                      <Image
                        source={props.observation.icon}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                      />
                    )}
                </View>
              )}
          </View>
        </View>
        <View style={styles.text}>
          <Text
            style={
              props.observation.name.length > 20
                ? styles.titleLong
                : styles.title
            }
          >
            {I18n.t(`categories.${props.observation.categoryId}`)}
          </Text>
          <Text>{dateString}</Text>
        </View>
        {props.observation &&
          !!props.observation.media.length && (
            <Image
              source={
                props.observation.media[0].type === 'LocalPhoto'
                  ? props.observation.media[0].source
                  : { uri: props.observation.media[0].source }
              }
              style={styles.media}
            />
          )}
      </View>
    </TouchableOpacity>
  );
};

export default ObservationCell;
