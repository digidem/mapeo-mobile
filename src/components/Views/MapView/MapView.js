// @flow
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import env from '@src/../env.json';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import { Observation } from '@types/observation';
import { isEmpty, map } from 'lodash';

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
    height: 300,
    alignSelf: 'stretch',
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

class MapView extends React.PureComponent<StateProps & DispatchProps, State> {
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

    return (
      <View style={{flex: 1}}>
        <Text>MapView</Text>
      </View>
    );

    // return (
    //   <View style={{ flex: 1 }}>
    //     {hasMapToken && (
    //       <MapboxGL.MapView style={styles.map}>
    //         <MapboxGL.ShapeSource id="smileyFaceSource" shape={geojson}>
    //           <MapboxGL.CircleLayer id="circles" style={mapboxStyles.point} />
    //         </MapboxGL.ShapeSource>
    //       </MapboxGL.MapView>
    //     )}
    //     {!hasMapToken && <View style={styles.mapPlaceholder} />}
    //     <View style={styles.container}>
    //       <View style={styles.buttons}>
    //         {map(observations, o => (
    //           <TouchableHighlight style={styles.btn} key={o.id}>
    //             <Text style={styles.btnText}>{`${o.lat}, ${o.lon}`}</Text>
    //           </TouchableHighlight>
    //         ))}
    //       </View>
    //       <Text style={styles.info}>{this.state.response}</Text>
    //     </View>
    //   </View>
    // );
  }
}

export default MapView;
