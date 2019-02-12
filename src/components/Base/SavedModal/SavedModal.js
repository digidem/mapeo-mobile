// @flow
import React from 'react';
import {
  Dimensions,
  View,
  Modal,
  Text,
  ImageBackground,
  StyleSheet
} from 'react-native';
import Image from 'react-native-remote-svg';
import type { Observation } from '../../../types/observation';
import type { Category } from '../../../types/category';
import Toast from '../Toast/Toast';
import I18n from 'react-native-i18n';
import moment from '../../../lib/localizedMoment';
import {
  WHITE,
  MAPEO_BLUE,
  LIGHT_GREY,
  VERY_LIGHT_BLUE,
  MEDIUM_GREY
} from '../../../lib/styles';
import getGPSText from '../../../lib/getGPSText';
import CategoryPin from '../../../images/category-pin.png';
import type { GPSFormat } from '../../../types/gps';
import { getSvgUri } from '../../../lib/media';

export type StateProps = {
  selectedObservation?: Observation,
  categories: {
    [id: string]: Category
  },
  gpsFormat: GPSFormat,
  icons: {
    [id: string]: string
  },
  show: boolean
};

export type DispatchProps = {
  onHide: () => void
};

const styles = StyleSheet.create({
  categoryContainer: {
    flex: 3,
    backgroundColor: VERY_LIGHT_BLUE,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  categoryPin: {
    width: 80,
    height: 90,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmationModal: {
    alignSelf: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.5,
    backgroundColor: 'white',
    borderRadius: 20
  },
  date: {
    color: MEDIUM_GREY,
    fontSize: 12,
    fontWeight: '400'
  },
  positionAtText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400'
  },
  positionText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '700'
  },
  syncedContainer: {
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center'
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class SavedModal extends React.PureComponent<StateProps & DispatchProps> {
  render() {
    const {
      onHide,
      selectedObservation,
      categories,
      gpsFormat,
      icons,
      show
    } = this.props;

    if (!selectedObservation || !show) {
      return null;
    }

    const positionText = getGPSText({
      gpsFormat,
      lat: selectedObservation.lat,
      lon: selectedObservation.lon
    });
    let category;

    if (selectedObservation.categoryId !== undefined) {
      category = categories[selectedObservation.categoryId];
    }

    return (
      <Toast onHide={onHide}>
        {selectedObservation && (
          <View
            style={{
              backgroundColor: 'rgba(52, 52, 52, 0.8)',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View style={styles.confirmationModal}>
              <View style={styles.syncedContainer}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '700',
                    color: 'black'
                  }}
                >
                  {I18n.t('saved')}
                </Text>
              </View>
              <View style={styles.categoryContainer}>
                <ImageBackground
                  source={CategoryPin}
                  style={styles.categoryPin}
                >
                  {category && (
                    <View style={{ marginTop: -10 }}>
                      {!!category.icon &&
                        !!icons[category.icon] && (
                          <Image
                            source={{
                              uri: getSvgUri(icons[category.icon])
                            }}
                            style={{ height: 30, width: 30 }}
                          />
                        )}
                    </View>
                  )}
                </ImageBackground>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 10
                  }}
                >
                  <Text style={styles.title}>
                    {selectedObservation.categoryId}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.positionAtText}>{I18n.t('at')} </Text>
                    <Text style={styles.positionText}>
                      {`${positionText}.`}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {I18n.t('on')}{' '}
                    {I18n.currentLocale().indexOf('en') !== -1
                      ? moment(selectedObservation.created_at).format(
                          'MMMM D YYYY, h:mm A'
                        )
                      : moment(selectedObservation.created_at).format('LLL')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </Toast>
    );
  }
}

export default SavedModal;
