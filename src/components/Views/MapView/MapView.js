// @flow
import React from 'react';
import { Image, StyleSheet, View, TouchableHighlight } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import type { Observation } from '@types/observation';
import { isEmpty, size, map, filter } from 'lodash';
import env from '../../../../env.json';

import AddButton from '../../../images/add-button.png';

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
  goToPosition: () => void,
  goToObservationDetail: () => void,
  selectObservation: (observation: Observation) => void
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

class MapView extends React.Component<StateProps & DispatchProps> {
  async componentDidMount() {
    const { observations, listObservations } = this.props;

    MapboxGL.setAccessToken(env.accessToken);
    await MapboxGL.requestAndroidLocationPermissions();

    // this.onDownloadProgress = this.onDownloadProgress.bind(this);
    // this.onDidFinishLoadingStyle = this.onDidFinishLoadingStyle.bind(this);

    if (!observations || isEmpty(observations)) {
      listObservations();
    }
  }

  map: any;

  handleCreateObservation = () => {
    const {
      createObservation,
      observations,
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
      observedBy: 'You',
      media: [],
      icon: null
    };

    goToPosition();

    createObservation(initialObservation);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        updateObservation({
          ...initialObservation,
          lat: Math.round(latitude * 1000) / 1000,
          lon: Math.round(longitude * 1000) / 1000
        });
      },
      error => console.warn(error)
    );
  };

  handlePress = (point: Object) => {
    const {
      observations,
      selectObservation,
      goToObservationDetail,
      resetNavigation
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
      resetNavigation();
      goToObservationDetail();
    }
  };

  handleLongPress = (point: Object) => {
    const { coordinates } = point.geometry;

    const { createObservation, observations, goToPosition } = this.props;
    const initialObservation = {
      type: 'Rios y corrientes',
      id: size(observations) + 1,
      lat: coordinates[1],
      lon: coordinates[0],
      link: 'link',
      created: new Date(),
      name: '',
      notes: '',
      observedBy: 'user',
      media: [],
      icon: null
    };

    goToPosition();

    createObservation(initialObservation);
  };

  render() {
    const { observations } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          showUserLocation
          ref={c => (this.map = c)}
          zoomLevel={12}
          logoEnabled
          onPress={this.handlePress}
          onLongPress={this.handleLongPress}
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
            height: 135,
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
            underlayColor="transparent"
          >
            <Image
              source={AddButton}
              style={{
                width: 125,
                height: 125
              }}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default MapView;
