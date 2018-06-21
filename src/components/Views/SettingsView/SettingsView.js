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
import LeftChevron from 'react-native-vector-icons/Feather';
import { LIGHT_GREY, WHITE, BLACK } from '../../../lib/styles';
import type { GPSFormat } from '../../../types/gps';

export type StateProps = {
  gpsFormat: GPSFormat
};

export type DispatchProps = {
  goBack: () => void,
  setGPSFormat: (format: GPSFormat) => void
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
    height: 60,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width
  },
  leftChevron: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BLACK,
    flex: 1
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

class SettingsView extends React.PureComponent<StateProps & DispatchProps> {
  handleValueSelect = (format: GPSFormat) => {
    const { setGPSFormat } = this.props;

    setGPSFormat(format);
  };

  render() {
    const { gpsFormat, goBack } = this.props;

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
          <TouchableOpacity onPress={goBack}>
            <LeftChevron color="#a5a5a4" name="chevron-left" size={30} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.empty} />
        </View>
        <View style={styles.container}>
          <View style={styles.fieldContainer}>
            <Text style={styles.heading}>GPS Coordinate Format</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                itemStyle={{ width: Dimensions.get('window').width - 40 }}
                onValueChange={this.handleValueSelect}
                selectedValue={gpsFormat}
              >
                <Picker.Item label="Decimal Degrees (DDD.DDDDD°)" value="DD" />
                <Picker.Item
                  label="Degrees & Decimal Minutes (DDD° MM.MMM')"
                  value="DDM"
                />
                <Picker.Item
                  label={"Degrees, Minutes, Seconds (DDD° MM' SS.S" + '"' + ')'}
                  value="DMS"
                />
                <Picker.Item
                  label="UTM Coordinates (10S 123456m E 7654321m N)"
                  value="UTM"
                />
              </Picker>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default SettingsView;
