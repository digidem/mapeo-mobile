/*!
* Mapeo Mobile is an Android app for offline participatory mapping.
*
* Copyright (C) 2017 Digital Democracy
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// @flow
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import RNNode from 'react-native-node';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import env from '../env.json';

type State = {
  response: string,
  hasMapToken: boolean,
  geojson: ?string,
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

export default class App extends Component<null, State> {
  state = { response: '', hasMapToken: true, geojson: null };

  async componentDidMount() {
    RNNode.start();
    await MapboxGL.requestAndroidLocationPermissions();
    MapboxGL.setAccessToken(env.accessToken);
  }

  render() {
    const { hasMapToken } = this.state;

    return (
      <View style={styles.container}>
        {hasMapToken && (
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.ShapeSource
              id="smileyFaceSource"
              shape={this.state.geojson}
            >
              <MapboxGL.CircleLayer id="circles" style={mapboxStyles.point} />
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        )}
        {!hasMapToken && <View style={styles.mapPlaceholder} />}
        <View style={styles.buttons}>
          <TouchableHighlight style={styles.btn}>
            <Text style={styles.btnText}>Ping</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.btn}>
            <Text style={styles.btnText}>Create</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.btn}>
            <Text style={styles.btnText}>Query</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.btn}>
            <Text style={styles.btnText}>Capabilities</Text>
          </TouchableHighlight>
        </View>
        <Text style={styles.info}>{this.state.response}</Text>
      </View>
    );
  }
}
