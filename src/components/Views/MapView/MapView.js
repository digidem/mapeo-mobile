// @flow
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Dimensions
} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import geoViewport from '@mapbox/geo-viewport';
import type { Observation } from '@types/observation';
import { isEmpty, size } from 'lodash';
import env from '../../../../env.json';

import CircleImg from '../../../images/circle-64.png';

export type StateProps = {
  observations: {
    [id: string]: Observation
  }
};

type State = {
  name: string,
  offlineRegionStatus: any | null
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

function getRegionDownloadState(downloadState) {
  switch (downloadState) {
    case MapboxGL.OfflinePackDownloadState.Active:
      return 'Active';
    case MapboxGL.OfflinePackDownloadState.Complete:
      return 'Complete';
    default:
      return 'Inactive';
  }
}

const CENTER_COORD = [-77.43049196, 0.1236344282];
const MAPBOX_VECTOR_TILE_SIZE = 512;

class MapView extends React.Component<StateProps & DispatchProps, State> {
  constructor() {
    super();

    this.state = {
      name: `Sinangoe`,
      offlineRegionStatus: null
    };
  }

  async componentDidMount() {
    const { observations, listObservations } = this.props;

    MapboxGL.setAccessToken(env.accessToken);
    await MapboxGL.requestAndroidLocationPermissions();

    this.onDownloadProgress = this.onDownloadProgress.bind(this);
    this.onDidFinishLoadingStyle = this.onDidFinishLoadingStyle.bind(this);

    if (!observations || isEmpty(observations)) {
      listObservations();
    }
  }

  componentWillUnmount() {
    // avoid setState warnings if we back out before we finishing downloading
    MapboxGL.offlineManager.deletePack(this.state.name);
    MapboxGL.offlineManager.unsubscribe('test');
  }

  async onDidFinishLoadingStyle() {
    const { width, height } = Dimensions.get('window');
    const bounds = geoViewport.bounds(
      CENTER_COORD,
      12,
      [width * 4, height * 4],
      MAPBOX_VECTOR_TILE_SIZE
    );

    const options = {
      name: this.state.name,
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
      minZoom: 10,
      maxZoom: 14
    };

    // start download
    MapboxGL.offlineManager.createPack(options, this.onDownloadProgress);
  }

  onDownloadProgress(offlineRegion, offlineRegionStatus) {
    this.setState({
      name: offlineRegion.name,
      offlineRegionStatus
    });
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
    const { offlineRegionStatus } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          centerCoordinate={CENTER_COORD}
          ref={c => (this.map = c)}
          onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
          maxZoom={14}
          minZoom={10}
          zoomLevel={12}
          zoomEnabled={false}
          pinchEnabled={false}
          rotateEnabled={false}
          logoEnabled
        />
        {offlineRegionStatus !== null &&
        offlineRegionStatus.percentage !== 100 ? (
          <View style={{ position: 'absolute', top: 0, left: 0 }}>
            <View style={{ flex: 1 }}>
              <Text>
                Download State:{' '}
                {getRegionDownloadState(offlineRegionStatus.state)}
              </Text>
              <Text>Download Percent: {offlineRegionStatus.percentage}</Text>
              <Text>
                Completed Resource Count:{' '}
                {offlineRegionStatus.completedResourceCount}
              </Text>
              <Text>
                Completed Resource Size:{' '}
                {offlineRegionStatus.completedResourceSize}
              </Text>
              <Text>
                Completed Tile Count: {offlineRegionStatus.completedTileCount}
              </Text>
              <Text>
                Required Resource Count:{' '}
                {offlineRegionStatus.requiredResourceCount}
              </Text>
            </View>
          </View>
        ) : null}
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
