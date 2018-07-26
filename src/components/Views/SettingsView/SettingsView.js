// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Picker,
  Dimensions
} from 'react-native';
import type { NavigationScreenProp } from 'react-navigation';
import I18n from 'react-native-i18n';
import LeftChevron from 'react-native-vector-icons/Feather';
import { LIGHT_GREY, WHITE, BLACK } from '../../../lib/styles';
import type { GPSFormat } from '../../../types/gps';
import type { Style } from '../../../types/map';

type Props = {
  navigation: NavigationScreenProp<*>
};

export type StateProps = {
  gpsFormat: GPSFormat,
  selectedStyle?: Style,
  styles: { [id: string]: Style },
  presets: string[],
  selectedPreset: string
};

export type DispatchProps = {
  setGPSFormat: (format: GPSFormat) => void,
  setSelectedStyle: (style: Style) => void,
  setSelectedPreset: (preset: string) => void
};

const styles = StyleSheet.create({
  closeDrawerButton: {
    backgroundColor: '#333333',
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 65,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width,
    paddingHorizontal: 15
  },
  leftChevron: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BLACK,
    flex: 1,
    textAlign: 'center'
  },
  empty: {
    width: 30
  },
  container: {
    flex: 1
  },
  fieldContainer: {
    padding: 20,
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

class SettingsView extends React.PureComponent<
  Props & StateProps & DispatchProps
> {
  handleValueSelect = (format: GPSFormat) => {
    const { setGPSFormat } = this.props;

    setGPSFormat(format);
  };

  handleStyleSelect = (style: string) => {
    const { setSelectedStyle, styles } = this.props;

    setSelectedStyle(styles[style]);
  };

  handlePresetSelect = (preset: string) => {
    const { setSelectedPreset } = this.props;

    setSelectedPreset(preset);
  };

  render() {
    const {
      gpsFormat,
      navigation,
      selectedStyle,
      selectedPreset,
      presets
    } = this.props;
    const mapStyles = this.props.styles;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: WHITE,
          justifyContent: 'flex-start'
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <LeftChevron color="#a5a5a4" name="chevron-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.title}>{I18n.t('settings.settings')}</Text>
          <View style={styles.empty} />
        </View>
        <View style={styles.container}>
          <View style={styles.fieldContainer}>
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
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('settings.map_style')}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                itemStyle={{ width: Dimensions.get('window').width - 40 }}
                onValueChange={this.handleStyleSelect}
                selectedValue={selectedStyle && selectedStyle.id}
              >
                {Object.keys(mapStyles).map(id => (
                  <Picker.Item
                    label={mapStyles[id].name.toString()}
                    value={id}
                    key={id}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>{I18n.t('settings.presets')}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                itemStyle={{ width: Dimensions.get('window').width - 40 }}
                onValueChange={this.handlePresetSelect}
                selectedValue={selectedPreset}
              >
                {presets.map(p => <Picker.Item label={p} value={p} key={p} />)}
              </Picker>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default SettingsView;
