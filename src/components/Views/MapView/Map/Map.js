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
import { NavigationActions, withNavigationFocus } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '@types/observation';
import { isEmpty, size, map, filter } from 'lodash';
import env from '../../../../../env.json';

import AddButton from '../../../../images/add-button.png';
import Gradient from '../../../../images/gradient-overlay.png';
import { WHITE } from '../../../../lib/styles';
import { applyObservationDefaults } from '../../../../models/observations';
import type { Resource } from '../../../../types/redux';
import type { GPSState } from '../../../../types/gps';
import type { Style } from '../../../../types/map';

export type StateProps = {
  observations: {
    [id: string]: Observation
  },
  selectedObservation?: Observation,
  gps?: GPSState,
  selectedStyle?: Style
};

export type DispatchProps = {
  listObservations: () => void,
  createObservation: (observation: Observation) => void,
  updateObservation: (observation: Observation) => void,
  selectObservation: (observation: Observation) => void,
  updateObservationSource: () => void,
  listStyles: () => void
};

type Props = {
  isFocused: boolean,
  navigation: NavigationActions
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
  },
  currentLocation: {
    circleColor: '#2657B1',
    circleRadius: 7,
    circleStrokeColor: '#fff',
    circleStrokeWidth: 3
  }
});

class Map extends React.Component<Props & StateProps & DispatchProps> {
  constructor() {
    super();

    MapboxGL.setAccessToken(env.accessToken);
  }

  componentDidMount() {
    const {
      observations,
      listObservations,
      selectedStyle,
      listStyles
    } = this.props;

    listObservations();

    if (!selectedStyle) {
      listStyles();
    }
  }

  shouldComponentUpdate(nextProps: Props & StateProps & DispatchProps) {
    if (nextProps.isFocused) {
      nextProps.listObservations();
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
      selectedObservation,
      updateObservationSource,
      selectedStyle,
      navigation
    } = this.props;
    const initialObservation = applyObservationDefaults({
      id: size(observations) + 1
    });

    navigation.navigate({
      routeName: 'Categories',
      key: 'CategoriesView'
    });
    updateObservationSource();
    createObservation(initialObservation);
  };

  handleObservationPress = (id: string) => {
    const { observations, selectObservation, navigation } = this.props;

    if (observations[id]) {
      selectObservation(observations[id]);
      navigation.navigate({ routeName: 'ObservationDetailView' });
    }
  };

  handleLongPress = (point: Object) => {
    const { coordinates } = point.geometry;
    const {
      createObservation,
      navigation,
      observations,
      updateObservationSource
    } = this.props;
    const initialObservation = applyObservationDefaults({
      id: size(observations) + 1,
      lat: coordinates[1],
      lon: coordinates[0]
    });

    navigation.navigate({
      routeName: 'Categories',
      key: 'CategoriesView'
    });
    updateObservationSource();
    createObservation(initialObservation);
  };

  handleMapViewRef = c => {
    this.map = c;
  };

  goToCurrentLocation = () => {
    const { gps } = this.props;

    if (this.map && gps) {
      this.map.moveTo([gps.longitude, gps.latitude], 200);
    }
  };

  render() {
    const { observations, gps, selectedStyle } = this.props;

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
            centerCoordinate={gps ? [gps.longitude, gps.latitude] : undefined}
            ref={this.handleMapViewRef}
            zoomLevel={
              selectedStyle
                ? Math.floor(
                    (selectedStyle.minzoom + selectedStyle.maxzoom) / 2
                  )
                : 12
            }
            minZoomLevel={selectedStyle ? selectedStyle.minzoom : undefined}
            maxZoomLevel={selectedStyle ? selectedStyle.maxzoom : undefined}
            logoEnabled
            onLongPress={this.handleLongPress}
            compassEnabled={false}
            styleURL={
              selectedStyle
                ? `http://localhost:9080/styles/${selectedStyle.id}/style.json`
                : undefined
            }
          >
            {!!observations && !isEmpty(observations)
              ? map(observations, (o: Observation) => (
                <MapboxGL.ShapeSource
                  onPress={() => this.handleObservationPress(o.id)}
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
            {gps && (
              <MapboxGL.ShapeSource
                key="current-location"
                id="current-location"
                shape={{
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [gps.longitude, gps.latitude]
                  }
                }}
              >
                <MapboxGL.CircleLayer
                  id="circles-current-location"
                  style={mapboxStyles.currentLocation}
                />
              </MapboxGL.ShapeSource>
            )}
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
            <TouchableOpacity onPress={this.goToCurrentLocation}>
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

export default withNavigationFocus(Map);
