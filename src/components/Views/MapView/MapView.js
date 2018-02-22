// @flow
import React from 'react';
import { Button, Image, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import env from '@src/../env.json';
import { NavigationActions } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import { Observation } from '@types/observation';
import { isEmpty, map } from 'lodash';

import CircleImg from '../../../images/circle-64.png';

type State = {
  response: string,
  hasMapToken: boolean,
  geojson: ?string,
};

export type StateProps = {
  observations: {
    [id: string]: Observation,
  },
};

export type DispatchProps = {
  listObservations: () => void,
};

type Props = {
  navigation: NavigationActions;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  mapPlaceholder: {
    backgroundColor: '#AAFFAA',
    alignSelf: 'stretch',
    height: 300,
  },

  map: {
    flex: 1,
    alignSelf: 'stretch',
  },

  newObservation: {
    alignSelf: 'center',
  },

  buttons: {
    flexDirection: 'row',
  },

  btn: {
    backgroundColor: '#4444FF',
    padding: 10,
    margin: 10,
  },

  btnText: {
    color: 'white',
  },

  info: {
    textAlign: 'left',
    color: '#333333',
    marginBottom: 5,
  },

});

const mapboxStyles = MapboxGL.StyleSheet.create({
  point: {
    circleColor: 'red',
  },
});

class MapView extends React.PureComponent<Props & StateProps & DispatchProps, State> {
  state = { response: '', hasMapToken: true, geojson: null };

  async componentDidMount() {
    const { observations, listObservations } = this.props;
    await MapboxGL.requestAndroidLocationPermissions();
    MapboxGL.setAccessToken(env.accessToken);

    if (!observations || isEmpty(observations)) {
      listObservations();
    }
  }

  render() {
    const { hasMapToken, geojson } = this.state;
    const { observations } = this.props;
    const { navigate } = this.props.navigation;

    return ( 
      <View style={{ flex: 1 }}>
        {hasMapToken && (
          <MapboxGL.MapView
            style={styles.map}
            styleURL={MapboxGL.StyleURL.Dark}
            showUserLocation={true}
          >
          </MapboxGL.MapView>
        )}
        {!hasMapToken && <View style={styles.mapPlaceholder} />}
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
          <TouchableHighlight onPress={() => navigate('Position')} style={styles.newObservation}>
            <Image source={CircleImg} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default MapView;
