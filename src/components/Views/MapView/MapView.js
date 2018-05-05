// @flow
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '@types/observation';
import { isEmpty, size, map, filter } from 'lodash';
import env from '../../../../env.json';

import AddButton from '../../../images/add-button.png';
import Gradient from '../../../images/gradient-overlay.png';
import { WHITE } from '../../../lib/styles';
import { applyObservationDefaults } from '../../../models/observations';

export type StateProps = {
  observations: {
    [id: string]: Observation
  },
  selectedObservation?: Observation
};

export type DispatchProps = {
  listObservations: () => void,
  createObservation: (observation: Observation) => void,
  updateObservation: (observation: Observation) => void,
  goToCategories: () => void,
  goToObservationDetail: () => void,
  selectObservation: (observation: Observation) => void
};

type Props = {
  isFocused: boolean
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  mapPlaceholder: {
    backgroundColor: '#000',
    color: '#FFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  map: {
    flex: 1,
    alignSelf: 'stretch'
  },

  newObservation: {
    alignSelf: 'center'
  },

  buttons: {
    flexDirection: 'row'
  },

  btn: {
    backgroundColor: '#4444FF',
    padding: 10,
    margin: 10
  },

  btnText: {
    color: 'white'
  },

  info: {
    textAlign: 'left',
    color: '#333333',
    marginBottom: 5
  }
});

const mapboxStyles = MapboxGL.StyleSheet.create({
  point: {
    circleColor: '#5086EC',
    circleRadius: 5,
    circleStrokeColor: '#fff',
    circleStrokeWidth: 2
  },
  observation: {
    circleColor: '#F29D4B',
    circleRadius: 5,
    circleStrokeColor: '#fff',
    circleStrokeWidth: 2
  }
});

class MapView extends React.Component<Props & StateProps & DispatchProps> {
  async componentDidMount() {
    const { observations, listObservations } = this.props;

    MapboxGL.setAccessToken(env.accessToken);
    await MapboxGL.requestAndroidLocationPermissions();
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    if (!observations || isEmpty(observations)) {
      listObservations();
    }
  }

  shouldComponentUpdate(nextProps: Props & StateProps & DispatchProps) {
    if (nextProps.isFocused) {
      return nextProps !== this.props;
    }

    return false;
  }

  map: any;

  handleCreateObservation = () => {
    const {
      createObservation,
      observations,
      updateObservation,
      goToCategories,
      selectedObservation
    } = this.props;
    const initialObservation = applyObservationDefaults({
      id: size(observations) + 1
    });
    goToCategories();

    createObservation(initialObservation);
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      updateObservation({
        ...(selectedObservation || initialObservation),
        lat: Math.round(latitude * 1000) / 1000,
        lon: Math.round(longitude * 1000) / 1000
      });
    });
  };

  handlePress = (point: Object) => {
    const {
      observations,
      selectObservation,
      goToObservationDetail
    } = this.props;
    const { coordinates } = point.geometry;

    const observation = filter(
      observations,
      o =>
        Math.round(o.lon * 1000) / 1000 ===
          Math.round(coordinates[0] * 1000) / 1000 &&
        Math.round(o.lat * 1000) / 1000 ===
          Math.round(coordinates[1] * 1000) / 1000
    );

    if (observation[0]) {
      selectObservation(observation[0]);
      goToObservationDetail();
    }
  };

  handleLongPress = (point: Object) => {
    const { coordinates } = point.geometry;

    const { createObservation, observations, goToCategories } = this.props;
    const initialObservation = applyObservationDefaults({
      id: size(observations) + 1
    });

    goToCategories();

    createObservation(initialObservation);
  };

  handleMapViewRef = c => {
    this.map = c;
  };

  render() {
    const { observations } = this.props;

    return (
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
      >
        <View style={{ flex: 1 }}>
          <MapboxGL.MapView
            style={{ flex: 1 }}
            showUserLocation
            ref={this.handleMapViewRef}
            zoomLevel={12}
            logoEnabled
            onPress={this.handlePress}
            onLongPress={this.handleLongPress}
            compassEnabled={false}
          >
            {!!observations && !isEmpty(observations)
              ? map(observations, (o: Observation) => (
                <MapboxGL.ShapeSource
                  key={o.id}
                  id={`observations-${o.id}`}
                  shape={{
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: [o.lon, o.lat]
                      },
                      properties: {
                        name: o.name
                      }
                    }}
                >
                  <MapboxGL.CircleLayer
                    id={`circles-${o.id}`}
                    style={mapboxStyles.observation}
                  />
                </MapboxGL.ShapeSource>
                ))
              : null}
          </MapboxGL.MapView>
          <View
            style={{
              position: 'absolute',
              bottom: 25,
              alignItems: 'center',
              backgroundColor: 'transparent',
              zIndex: 5,
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: Dimensions.get('window').width
            }}
          >
            <View style={{ width: 50 }} />
            <TouchableOpacity
              onPress={this.handleCreateObservation}
              style={styles.newObservation}
            >
              <Image
                source={AddButton}
                style={{
                  width: 125,
                  height: 125
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('ere')}>
              <Icon color={WHITE} name="my-location" size={50} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            left: 0,
            backgroundColor: 'transparent'
          }}
        >
          <ImageBackground
            source={Gradient}
            style={{
              width: Dimensions.get('window').width,
              height: 100
            }}
          />
        </View>
      </View>
    );
  }
}

export default withNavigationFocus(MapView);
