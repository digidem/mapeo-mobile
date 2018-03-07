// @flow
import React from 'react';
import { Image, StyleSheet, View, TouchableHighlight } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import type { Observation } from '@types/observation';
import { isEmpty, size } from 'lodash';
import env from '../../../../env.json';

import CircleImg from '../../../images/circle-64.png';

const styleURL = 'http://localhost:9080/style.json';

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

type State = {
  hasMapToken: boolean
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

const CENTER_COORD = [23.466667, 4.566667];

class MapView extends React.PureComponent<StateProps & DispatchProps, State> {
  state = {
    hasMapToken: true
  };

  async componentDidMount() {
    const { observations, listObservations } = this.props;
    MapboxGL.setAccessToken(env.accessToken);
    await MapboxGL.requestAndroidLocationPermissions();

    if (!observations || isEmpty(observations)) {
      listObservations();
    }

    this.check();
  }

  async check() {
    const resp = await fetch('http://localhost:9080/style.json');
    console.log(resp, this.state.hasMapToken);
  }

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
      media: []
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
    const { hasMapToken } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {hasMapToken && (
          <MapboxGL.MapView
            style={styles.map}
            styleURL={styleURL}
            centerCoordinate={CENTER_COORD}
            zoomLevel={8}
            maxZoom={24}
            minZoom={2}
          />
        )}
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
