// @flow
import React from 'react';
import { Image, StyleSheet, View, TouchableHighlight } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import type { Observation } from '@types/observation';
import { isEmpty, size } from 'lodash';
import env from '../../../../env.json';

import CircleImg from '../../../images/circle-64.png';

export type StateProps = {
  observations: {
    [id: string]: Observation
  }
};

export type DispatchProps = {
  listObservations: () => void,
  createObservation: (observation: Observation) => void,
  updateObservation: (observation: Observation) => void,
  resetNavigation: () => void,
  goToPosition: () => void
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

// const mapboxStyles = MapboxGL.StyleSheet.create({
//   point: {
//     circleColor: 'red'
//   }
// });

// const CENTER_COORD = [-77.43049196, 0.1236344282];
const CENTER_COORD = [-122.2632601, 37.8027446];
const STYLE = {
  version: 8,
  sources: {
    'simple-tiles': {
      type: 'raster',
      // point to our third-party tiles. Note that some examples
      // show a "url" property. This only applies to tilesets with
      // corresponding TileJSON (such as mapbox tiles).
      tiles: ['http://localhost:9080/tiles/{z}/{x}/{y}.png'],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'simple-tiles',
      minzoom: 12,
      maxzoom: 12
    }
  ]
};

class MapView extends React.PureComponent<StateProps & DispatchProps> {
  async componentDidMount() {
    const { observations, listObservations } = this.props;
    MapboxGL.setAccessToken(env.accessToken);
    await MapboxGL.requestAndroidLocationPermissions();
    const resp = await fetch('http://localhost:9080/tiles/12/1581/655.png');
    console.log(JSON.stringify(resp));

    if (!observations || isEmpty(observations)) {
      listObservations();
    }
  }

  onError = err => {
    console.log('RN - ', err);
  };

  handleCreateObservation = () => {
    const {
      createObservation,
      observations,
      resetNavigation,
      updateObservation,
      goToPosition
    } = this.props;
    const initialObservation = {
      type: 'Rios y corrientes',
      id: size(observations) + 1,
      lat: 0,
      lon: 0,
      link: 'link',
      created: new Date(),
      name: '',
      notes: '',
      observedBy: 'user',
      media: [],
      icon: null
    };

    resetNavigation();
    goToPosition();

    createObservation(initialObservation);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        updateObservation({
          ...initialObservation,
          lat: Math.round(latitude),
          lon: Math.round(longitude)
        });
      },
      error => console.warn(error)
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={styles.map}
          // styleURL="mapbox://styles/mapbox/satellite-v9"
          centerCoordinate={CENTER_COORD}
          zoomLevel={12}
          maxZoom={12}
          minZoom={12}
          zoomEnabled={false}
          pitchEnabled={false}
          scrollEnabled={false}
          rotateEnabled={false}
          logoEnabled
        >
          <MapboxGL.RasterSource
            id="base"
            url="http://localhost:9080/tile.json"
            tileSize={256}
            minZoomLevel={12}
            maxZoomLevel={12}
          >
            <MapboxGL.RasterLayer
              id="baseLayer"
              sourceID="base"
              style={{ rasterOpacity: 0.7 }}
            />
          </MapboxGL.RasterSource>
        </MapboxGL.MapView>
        <View
          style={{
            height: 100,
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            backgroundColor: 'transparent',
            zIndex: 5
          }}
        >
          <TouchableHighlight
            onPress={this.handleCreateObservation}
            style={styles.newObservation}
          >
            <Image source={CircleImg} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default MapView;
