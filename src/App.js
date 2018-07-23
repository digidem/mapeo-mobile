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
import nodejs from 'nodejs-mobile-react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import GeoLocation from '@digidem/react-native-geolocation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import throttle from 'lodash/throttle';
import 'rxjs';
import { configureStore } from './lib/store';
import { locationUpdate, locationError } from './ducks/gps';
import { appReady } from './ducks/app';
import AppNavigation from './components/AppNavigation';
import SplashScreen from './images/splash-screen.png';

export default class App extends React.PureComponent<null, null> {
  store: any;
  persistor: any;
  loc: any;

  constructor() {
    super();

    const { store, persistor } = configureStore();
    this.store = store;
    this.persistor = persistor;
    this.loc = new GeoLocation();
  }

  async componentDidMount() {
    nodejs.start('index.js');

    // set permissions
    await MapboxGL.requestAndroidLocationPermissions();
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    this.loc.startObserving(
      throttle(this.handlePositionChange, 1000),
      this.handlePositionError
    );

    this.store.dispatch(appReady());
  }

  handlePositionChange = (position: Position) => {
    this.store.dispatch(locationUpdate(position));
  };

  handlePositionError = (error: PositionError) => {
    this.store.dispatch(locationError(error));
  };

  componentWillUnmount() {
    this.loc.stopObserving();
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
