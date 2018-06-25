// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Picker,
  TextInput
} from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import I18n from 'react-native-i18n';
import LeftChevron from 'react-native-vector-icons/Feather';
import CheckIcon from 'react-native-vector-icons/Octicons';
import { toLatLon } from 'utm';
import type { Observation } from '../../../types/observation';
import type { GPSFormat } from '../../../types/gps';
import {
  MANGO,
  DARK_MANGO,
  LIGHT_GREY,
  BLACK,
  WHITE,
  RED
} from '../../../lib/styles';

type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  gpsFormat: GPSFormat,
  selectedObservation?: Observation,
  observationSource?: string
};

export type DispatchProps = {
  updateObservation: (observation: Observation) => void,
  setGPSFormat: (format: GPSFormat) => void,
  showSavedModal: () => void
};

type State = {
  longitude?: Object,
  latitude?: Object,
  zoneCode?: string,
  zoneNumber?: string,
  easting?: string,
  northing?: string,
  error?: Object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width,
    backgroundColor: WHITE,
    paddingHorizontal: 10
  },
  check: {
    backgroundColor: MANGO,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkOuterCircle: {
    width: 30,
    height: 30,
    backgroundColor: DARK_MANGO,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkIcon: {
    alignSelf: 'center',
    marginLeft: 3
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BLACK,
    flex: 1,
    textAlign: 'center'
  },
  fieldContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'column'
  },
  heading: {
    fontSize: 14,
    color: BLACK,
    marginBottom: 10,
    fontWeight: '700'
  },
  pickerContainer: {
    backgroundColor: WHITE,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    borderRadius: 3
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ManualGPS extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor() {
    super();

    this.state = {};
  }

  handleSaveObservation = () => {
    const {
      updateObservation,
      gpsFormat,
      selectedObservation,
      showSavedModal,
      observationSource,
      navigation
    } = this.props;
    const {
      longitude,
      latitude,
      easting,
      northing,
      zoneNumber,
      zoneCode
    } = this.state;
    let lat;
    let lon;
    let east;
    let north;
    let num;

    switch (gpsFormat) {
      case 'DD':
        lat = latitude && parseFloat(latitude.degree);
        lon = longitude && parseFloat(longitude.degree);
        break;
      case 'DDM':
        lat =
          latitude &&
          parseInt(latitude.degree) + parseFloat(latitude.minute) / 60;
        lon =
          longitude &&
          parseInt(longitude.degree) + parseFloat(longitude.minute) / 60;
        break;
      case 'DMS':
        lat =
          latitude &&
          parseInt(latitude.degree) +
            parseInt(latitude.minute) / 60 +
            parseFloat(latitude.second) / 3600;
        lon =
          longitude &&
          parseInt(longitude.degree) +
            parseInt(longitude.minute) / 60 +
            parseFloat(longitude.second) / 3600;
        break;
      case 'UTM':
        east = parseInt(easting);
        north = parseInt(northing);
        num = parseInt(zoneNumber);
        break;
      default:
        break;
    }

    const errorState = {};
    if (lat !== undefined && (!lat || lat < -90 || lat > 90)) {
      errorState.latitude = true;
    }

    if (lon !== undefined && (!lon || lon < -90 || lon > 90)) {
      errorState.longitude = true;
    }

    if (east !== undefined && (!east || east < 100000 || east >= 1000000)) {
      errorState.easting = true;
    }

    if (north !== undefined && (!north || north < 0 || north > 10000000)) {
      errorState.northing = true;
    }

    if (zoneCode !== undefined && (!zoneCode || zoneCode.length > 1)) {
      errorState.zoneCode = true;
    }

    if (num !== undefined && !num) {
      errorState.zoneNumber = true;
    }

    let updated;
    if (Object.keys(errorState).length) {
      this.setState({ error: errorState });
    } else if (lat && lon && selectedObservation) {
      updateObservation({
        ...selectedObservation,
        lon,
        lat
      });
      updated = true;
    } else if (east && north && zoneCode && num && selectedObservation) {
      try {
        const latLon = toLatLon(east, north, num, zoneCode);
        updateObservation({
          ...selectedObservation,
          lon: latLon.longitude,
          lat: latLon.latitude
        });
        updated = true;
      } catch (error) {
        errorState.easting = true;
        errorState.northing = true;
        errorState.zoneCode = true;
        errorState.zoneNumber = true;
      }
    }

    if (updated) {
      showSavedModal();
      if (observationSource === 'map') {
        navigation.navigate({ routeName: 'MapView' });
      } else {
        navigation.navigate({
          routeName: 'CameraView',
          params: { showEditorView: false }
        });
      }
    }
  };

  handleValueSelect = (format: GPSFormat) => {
    const { setGPSFormat } = this.props;

    setGPSFormat(format);
  };

  renderTextInput = (
    placeholder: string,
    overrideStyles: Object,
    handleChange: (text: string) => void
  ) => (
    <TextInput
      keyboardType="numeric"
      style={[
        {
          backgroundColor: WHITE,
          borderColor: LIGHT_GREY,
          borderWidth: 1,
          borderRadius: 3,
          marginRight: 10,
          paddingHorizontal: 10
        },
        overrideStyles
      ]}
      placeholder={placeholder}
      underlineColorAndroid="transparent"
      onChangeText={handleChange}
    />
  );

  renderBottomInput = () => {
    const { gpsFormat } = this.props;
    const { latitude, error, easting, northing } = this.state;

    switch (gpsFormat) {
      case 'DD':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('manual_gps.latitude')}</Text>
            <View style={{ flexDirection: 'row' }}>
              {this.renderTextInput(
                '+/- DDD.DDDDD',
                {
                  flex: 1,
                  borderColor:
                    (error && error.latitude) ||
                    (latitude && !parseFloat(latitude.degree))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    latitude: latitude
                      ? { ...latitude, degree: text }
                      : { degree: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                °
              </Text>
            </View>
          </View>
        );
      case 'DDM':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('manual_gps.latitude')}</Text>
            <View style={{ flexDirection: 'row' }}>
              {this.renderTextInput(
                'DDD',
                {
                  minWidth: 100,
                  borderColor:
                    (error && error.latitude) ||
                    (latitude && !parseInt(latitude.degree))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    latitude: latitude
                      ? { ...latitude, degree: text }
                      : { degree: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                °
              </Text>
              {this.renderTextInput(
                'MM.MMM',
                {
                  flex: 1,
                  marginHorizontal: 10,
                  borderColor:
                    (error && error.latitude) ||
                    (latitude && !parseFloat(latitude.minute))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    latitude: latitude
                      ? { ...latitude, minute: text }
                      : { minute: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                '
              </Text>
            </View>
          </View>
        );
      case 'DMS':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('manual_gps.latitude')}</Text>
            <View style={{ flexDirection: 'row' }}>
              {this.renderTextInput(
                'DDD',
                {
                  minWidth: 100,
                  borderColor:
                    (error && error.latitude) ||
                    (latitude && !parseInt(latitude.degree))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    latitude: latitude
                      ? { ...latitude, degree: text }
                      : { degree: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                °
              </Text>
              {this.renderTextInput(
                'MM',
                {
                  marginHorizontal: 10,
                  minWidth: 50,
                  borderColor:
                    (error && error.latitude) ||
                    (latitude && !parseInt(latitude.minute))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    latitude: latitude
                      ? { ...latitude, minute: text }
                      : { minute: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                '
              </Text>
              {this.renderTextInput(
                'SS.S',
                {
                  marginHorizontal: 10,
                  flex: 1,
                  borderColor:
                    (error && error.latitude) ||
                    (latitude && !parseFloat(latitude.second))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    latitude: latitude
                      ? { ...latitude, second: text }
                      : { second: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                ''
              </Text>
            </View>
          </View>
        );
      case 'UTM':
        return (
          <View
            style={[
              styles.fieldContainer,
              { marginTop: 20, flexDirection: 'row' }
            ]}
          >
            <View
              style={[
                styles.fieldContainer,
                { flex: 0.5, paddingHorizontal: 0, paddingRight: 10 }
              ]}
            >
              <Text style={styles.heading}>{I18n.t('manual_gps.easting')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.renderTextInput(
                  '123456',
                  {
                    flex: 1,
                    borderColor:
                      (error && error.easting) ||
                      (easting && !parseInt(easting))
                        ? RED
                        : LIGHT_GREY
                  },
                  text =>
                    this.setState({
                      easting: text
                    })
                )}
                <Text style={{ color: BLACK, fontSize: 15 }}>m E</Text>
              </View>
            </View>
            <View
              style={[
                styles.fieldContainer,
                { flex: 0.5, paddingHorizontal: 0 }
              ]}
            >
              <Text style={styles.heading}>
                {I18n.t('manual_gps.northing')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.renderTextInput(
                  '123456',
                  {
                    flex: 1,
                    borderColor:
                      (error && error.northing) ||
                      (northing && !parseInt(northing))
                        ? RED
                        : LIGHT_GREY
                  },
                  text =>
                    this.setState({
                      northing: text
                    })
                )}
                <Text style={{ color: BLACK, fontSize: 15 }}>m N</Text>
              </View>
            </View>
          </View>
        );
      default:
        break;
    }
  };

  renderTopInput = () => {
    const { gpsFormat } = this.props;
    const { longitude, zoneCode, zoneNumber, error } = this.state;

    switch (gpsFormat) {
      case 'DD':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('manual_gps.longitude')}</Text>
            <View style={{ flexDirection: 'row' }}>
              {this.renderTextInput(
                '+/- DDD.DDDDD',
                {
                  flex: 1,
                  borderColor:
                    (error && error.longitude) ||
                    (longitude && !parseFloat(longitude.degree))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    longitude: longitude
                      ? { ...longitude, degree: text }
                      : { degree: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                °
              </Text>
            </View>
          </View>
        );
      case 'DDM':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('manual_gps.longitude')}</Text>
            <View style={{ flexDirection: 'row' }}>
              {this.renderTextInput(
                'DDD',
                {
                  minWidth: 100,
                  borderColor:
                    (error && error.longitude) ||
                    (longitude && !parseInt(longitude.degree))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    longitude: longitude
                      ? { ...longitude, degree: text }
                      : { degree: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                °
              </Text>
              {this.renderTextInput(
                'MM.MMM',
                {
                  flex: 1,
                  marginHorizontal: 10,
                  borderColor:
                    (error && error.longitude) ||
                    (longitude && !parseFloat(longitude.minute))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    longitude: longitude
                      ? { ...longitude, minute: text }
                      : { minute: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                '
              </Text>
            </View>
          </View>
        );
      case 'DMS':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('manual_gps.longitude')}</Text>
            <View style={{ flexDirection: 'row' }}>
              {this.renderTextInput(
                'DDD',
                {
                  minWidth: 100,
                  borderColor:
                    (error && error.longitude) ||
                    (longitude && !parseInt(longitude.degree))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    longitude: longitude
                      ? { ...longitude, degree: text }
                      : { degree: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                °
              </Text>
              {this.renderTextInput(
                'MM',
                {
                  marginHorizontal: 10,
                  minWidth: 50,
                  borderColor:
                    (error && error.longitude) ||
                    (longitude && !parseInt(longitude.minute))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    longitude: longitude
                      ? { ...longitude, minute: text }
                      : { minute: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                '
              </Text>
              {this.renderTextInput(
                'SS.S',
                {
                  marginHorizontal: 10,
                  flex: 1,
                  borderColor:
                    (error && error.longitude) ||
                    (longitude && !parseFloat(longitude.second))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    longitude: longitude
                      ? { ...longitude, second: text }
                      : { second: text }
                  })
              )}
              <Text style={{ color: BLACK, fontSize: 15, fontWeight: '700' }}>
                ''
              </Text>
            </View>
          </View>
        );
      case 'UTM':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('manual_gps.grid_zone')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {this.renderTextInput(
                '18',
                {
                  marginRight: 10,
                  flex: 1,
                  minHeight: 50,
                  borderColor:
                    (error && error.zoneNumber) ||
                    (zoneNumber && !parseInt(zoneNumber))
                      ? RED
                      : LIGHT_GREY
                },
                text =>
                  this.setState({
                    zoneNumber: text
                  })
              )}
              <TextInput
                style={{
                  backgroundColor: WHITE,
                  borderColor:
                    (error && error.zoneCode) ||
                    (zoneCode && zoneCode.length > 1)
                      ? RED
                      : LIGHT_GREY,
                  borderWidth: 1,
                  borderRadius: 3,
                  paddingHorizontal: 10,
                  minWidth: 50,
                  fontSize: 15,
                  minHeight: 50
                }}
                placeholder="S"
                underlineColorAndroid="transparent"
                onChangeText={text =>
                  this.setState({
                    zoneCode: text
                  })
                }
              />
            </View>
          </View>
        );
      default:
        break;
    }
  };

  render() {
    const { navigation, gpsFormat } = this.props;
    const goBack = navigation.goBack();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <LeftChevron color="#a5a5a4" name="chevron-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.title}>{I18n.t('manual_gps.manual_gps')}</Text>
          <TouchableOpacity
            style={styles.checkOuterCircle}
            onPress={this.handleSaveObservation}
          >
            <View style={styles.check}>
              <CheckIcon
                color="white"
                name="check"
                size={18}
                style={styles.checkIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={[styles.fieldContainer, { paddingTop: 20 }]}>
            <Text style={styles.heading}>{I18n.t('settings.gps_format')}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                itemStyle={{ width: Dimensions.get('window').width - 40 }}
                onValueChange={this.handleValueSelect}
                selectedValue={gpsFormat}
              >
                <Picker.Item
                  label={`${I18n.t('settings.dd')} (DDD.DDDDD°)`}
                  value="DD"
                />
                <Picker.Item
                  label={`${I18n.t('settings.ddm')} (DDD° MM.MMM')`}
                  value="DDM"
                />
                <Picker.Item
                  label={`${I18n.t('settings.dms')} (DDD° MM' SS.S")`}
                  value="DMS"
                />
                <Picker.Item
                  label={`${I18n.t('settings.utm')} (10S 123456m E 7654321m N)`}
                  value="UTM"
                />
              </Picker>
            </View>
          </View>
          {this.renderTopInput()}
          {this.renderBottomInput()}
        </View>
      </View>
    );
  }
}

export default withNavigation(ManualGPS);
