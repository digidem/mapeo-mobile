// @flow
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  Dimensions,
  Text
} from 'react-native';
import env from '@src/../env.json';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import geoViewport from '@mapbox/geo-viewport';
import type { Observation } from '@types/observation';
import { isEmpty, size } from 'lodash';

import CircleImg from '../../../images/circle-64.png';

type State = {
  hasMapToken: boolean,
  offlineRegion: any,
  offlineRegionStatus: any
};

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

const CENTER_COORD = [23.466667, 4.566667];
const MAPBOX_VECTOR_TILE_SIZE = 512;

class MapView extends React.PureComponent<StateProps & DispatchProps, State> {
  state = {
    hasMapToken: true,
    offlineRegion: null,
    offlineRegionStatus: null
  };

  async componentDidMount() {
    const { observations, listObservations } = this.props;
    MapboxGL.setAccessToken(env.accessToken);
    await MapboxGL.requestAndroidLocationPermissions();
    await MapboxGL.offlineManager.getPack('Sinangoe');

    if (!observations || isEmpty(observations)) {
      listObservations();
    }
  }

  async onDidFinishLoadingStyle() {
    const { width, height } = Dimensions.get('window');
    const bounds = geoViewport.bounds(
      CENTER_COORD,
      12,
      [width, height],
      MAPBOX_VECTOR_TILE_SIZE
    );

    const options = {
      name: 'Sinangoe',
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
      minZoom: 2,
      maxZoom: 24
    };

    // start download
    console.log('RN - start download');
    await MapboxGL.offlineManager.createPack(
      options,
      this.onDownloadProgress,
      this.onError
    );
  }

  onDownloadProgress = (offlineRegion, offlineRegionStatus) => {
    console.log('RN - ', offlineRegionStatus, offlineRegionStatus.percentage);
    this.setState({
      offlineRegion,
      offlineRegionStatus
    });
  };

  onError = err => {
    console.log('RN - ', err);
  };

  getRegionDownloadState = (downloadState: string) => {
    switch (downloadState) {
      case MapboxGL.OfflinePackDownloadState.Active:
        return 'Active';
      case MapboxGL.OfflinePackDownloadState.Complete:
        return 'Complete';
      default:
        return 'Inactive';
    }
  };

  formatPercent = () => {
    if (!this.state.offlineRegionStatus) {
      return '0%';
    }
    return Math.round(this.state.offlineRegionStatus.percentage / 10) / 10;
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
    const { hasMapToken, offlineRegionStatus } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, color: '#FFF' }}>
          Download Percent: {this.formatPercent()}
        </Text>
        {hasMapToken && (
          <MapboxGL.MapView
            style={styles.map}
            styleURL="mapbox://styles/mapbox/light-v9"
            centerCoordinate={CENTER_COORD}
            onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
            zoomLevel={8}
            maxZoom={24}
            minZoom={2}
          />
        )}
        {(!hasMapToken || offlineRegionStatus !== null) && (
          <View style={styles.mapPlaceholder}>
            <Text style={{ fontSize: 20, color: '#FFF' }}>
              Download Percent: {this.formatPercent()}
            </Text>
          </View>
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
