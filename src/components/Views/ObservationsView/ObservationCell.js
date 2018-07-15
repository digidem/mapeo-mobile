// @flow
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import I18n from 'react-native-i18n';
import Image from 'react-native-remote-svg';

import type { Observation } from '../../../types/observation';
import type { Category } from '../../../types/category';
import { LIGHT_GREY } from '../../../lib/styles';
import moment from '../../../lib/localizedMoment';
import Thumbnail from '../../Base/Thumbnail';

type Props = {
  currentLocale: string,
  observation: Observation,
  category: Category,
  onPress: (i: Observation) => void,
  icons: Object
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
  icon: { width: 15, height: 15 },
  iconWithMedia: { width: 12, height: 12 },
  innerCircle: {
    width: 40,
    height: 40,
    backgroundColor: LIGHT_GREY,
    borderRadius: 50
  },
  title: { fontSize: 18, fontWeight: '700', color: 'black' },
  titleLong: { fontSize: 16, fontWeight: '700', color: 'black' },
  media: { width: 60, height: 60, borderRadius: 7 }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ObservationCell extends React.Component<Props> {
  render() {
    const { currentLocale, observation, onPress, category, icons } = this.props;
    const esLocale = require('moment/locale/es');
    let dateString;
    if (currentLocale && currentLocale.includes('es')) {
      dateString = moment(observation.created).calendar(null, {
        sameDay: '[Hoy], h:mm A',
        nextDay: '[Mañana], h:mm A',
        nextWeek: 'ddd, h:mm A',
        lastDay: '[Ayer], h:mm A',
        lastWeek: 'ddd, h:mm A',
        sameElse: 'MM/D/YYYY, h:mm A'
      });
    } else {
      dateString = moment(observation.created).calendar(null, {
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

    const hasMedia = observation && !!observation.attachments.length;
    const source = hasMedia ? observation.attachments[0] : '';

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.container}>
          <View style={styles.text}>
            <Text style={styles.title}>{dateString}</Text>
            <Text>{observation.categoryId}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            {hasMedia && (
              <Thumbnail attachmentId={source} style={styles.media} />
            )}
            <View
              style={[styles.circle, hasMedia ? styles.circleWithMedia : {}]}
            >
              {!!category &&
                !!category.icon &&
                !!icons[category.icon] && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Image
                      source={{
                        uri: `data:image/svg+xml;utf8,${icons[category.icon]}`
                      }}
                      style={hasMedia ? styles.iconWithMedia : styles.icon}
                    />
                  </View>
                )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ObservationCell;
