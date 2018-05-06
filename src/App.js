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
import React from 'react';
import { PermissionsAndroid, Image, Dimensions } from 'react-native';
import RNNode from 'react-native-node';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import 'rxjs';
import { configureStore } from './lib/store';
import { gpsSet } from './ducks/gps';
import AppNavigation from './components/AppNavigation';
import SplashScreen from './images/splash-screen.png';

export default class App extends React.PureComponent<null, null> {
  watchId: number;
  store: any;
  persistor: any;

  constructor() {
    super();

    const { store, persistor } = configureStore();
    this.store = store;
    this.persistor = persistor;
  }

  async componentDidMount() {
    RNNode.start();

    // set permissions
    await MapboxGL.requestAndroidLocationPermissions();
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    this.watchId = navigator.geolocation.watchPosition(
      this.handlePositionChange
    );
    navigator.geolocation.getCurrentPosition(this.handlePositionChange);
  }

  handlePositionChange = position => {
    this.store.dispatch(gpsSet(position.coords));
  };

  componentWillUnmount() {
    if (this.watchId) {
      navigator.geolocation.stopObserving();
    }
  }

  render() {
    if (!this.store || !this.persistor) {
      return (
        <Image
          source={SplashScreen}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
        />
      );
    }

    return (
      <Provider store={this.store}>
        <PersistGate persistor={this.persistor}>
          <AppNavigation />
        </PersistGate>
      </Provider>
    );
  }
}
