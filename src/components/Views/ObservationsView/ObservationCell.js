// @flow
import React from 'react';
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
import moment from '../../../lib/localizedMoment';

export type Props = {
  currentLocale: string,
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
    width: Dimensions.get('window').width,
    paddingHorizontal: 20
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
    marginRight: -5,
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  circleWithMedia: {
    position: 'absolute',
    right: 0,
    bottom: -5,
    width: 25,
    height: 25,
    zIndex: 5
  },
  icon: {
    width: 15,
    height: 15
  },
  iconWithMedia: {
    width: 12,
    height: 12
  },
  innerCircle: {
    width: 40,
    height: 40,
    backgroundColor: LIGHT_GREY,
    borderRadius: 50
  },
  title: {
    fontSize: 18,
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
  const esLocale = require('moment/locale/es');
  const currentLocale = props.currentLocale;
  const { observation, onPress } = props;
  let dateString;
  if (currentLocale && currentLocale.includes('es')) {
    dateString = moment(props.observation.created).calendar(null, {
      sameDay: '[Hoy], h:mm A',
      nextDay: '[Mañana], h:mm A',
      nextWeek: 'ddd, h:mm A',
      lastDay: '[Ayer], h:mm A',
      lastWeek: 'ddd, h:mm A',
      sameElse: 'MM/D/YYYY, h:mm A'
    });
  } else {
    dateString = moment(props.observation.created).calendar(null, {
      sameDay: '[Today], h:mm A',
      nextDay: '[Tomorrow], h:mm A',
      nextWeek: 'ddd, h:mm A',
      lastDay: '[Yesterday], h:mm A',
      lastWeek: 'ddd, h:mm A',
      sameElse: 'MM/D/YYYY, h:mm A'
    });
  }

  const handlePress = () => {
    onPress(observation);
  };

  const hasMedia = observation && !!observation.media.length;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.text}>
          <Text style={styles.title}>{dateString}</Text>
          <Text>
            {I18n.t(
              `categories.${
                observation.categoryId ? observation.categoryId : ''
              }`
            )}
          </Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          {hasMedia && (
            <Image
              source={{ uri: observation.media[0].source }}
              style={styles.media}
            />
          )}
          <View style={[styles.circle, hasMedia ? styles.circleWithMedia : {}]}>
            {!!observation &&
              !!observation.icon && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    source={observation.icon}
                    style={hasMedia ? styles.iconWithMedia : styles.icon}
                    resizeMode="contain"
                  />
                </View>
              )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ObservationCell;
