// @flow

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Device } from '../../../types/device';
import {
  DARK_BLUE,
  DARK_MANGO,
  MANGO,
  MAPEO_BLUE,
  MEDIUM_BLUE
} from '../../../lib/styles';

export type Props = {
  device: Device,
  onPress: (i: Device) => void
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

const DeviceCell = (props: Props) => {
  const handlePress = () => {
    props.onPress(props.device);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={{
          height: 80,
          flexDirection: 'row',
          backgroundColor: props.device.selected ? MEDIUM_BLUE : MAPEO_BLUE,
          justifyContent: 'flex-start',
          alignItems: 'center',
          borderBottomColor: DARK_BLUE,
          borderBottomWidth: 1,
          width: Dimensions.get('window').width,
          paddingHorizontal: 20
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'white',
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -15
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: props.device.selected ? 'black' : MAPEO_BLUE,
              height: 15,
              width: 15,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginLeft: 30
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
              fontSize: 18
            }}
          >
            {props.device.name}
          </Text>
          <Text
            style={{
              color: 'white',
              fontWeight: '400',
              fontSize: 12
            }}
          >
            {I18n.t('sync.via_wifi')}
          </Text>
        </View>
        {props.device.selected && (
          <TouchableOpacity
            style={{
              backgroundColor: 'transparent',
              position: 'absolute',
              right: 20
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                backgroundColor: DARK_MANGO,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 50,
                  backgroundColor: MANGO
                }}
              >
                <Icon
                  color="white"
                  name="arrow-forward"
                  size={23}
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    transform: [{ rotate: '-45deg' }]
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default DeviceCell;
