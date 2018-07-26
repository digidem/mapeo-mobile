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
import GeoLocation from '@digidem/react-native-geolocation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import throttle from 'lodash/throttle';
import 'rxjs';
import { configureStore } from './lib/store';
import { locationUpdate, locationError } from './ducks/gps';
import { observationList } from './ducks/observations';
import { styleList } from './ducks/map';
import { fieldList } from './ducks/fields';
import { presetsList } from './ducks/presets';
import { API_DOMAIN_URL } from './api/base';
import AppNavigation from './components/AppNavigation/AppNavigation';
import SplashScreen from './images/splash-screen.png';

type State = {
  ready: boolean
};

export default class App extends React.PureComponent<null, State> {
  store: any;
  persistor: any;
  loc: any;
  timeout: TimeoutID;

  constructor() {
    super();

    const { store, persistor } = configureStore();
    this.store = store;
    this.persistor = persistor;
    this.loc = new GeoLocation();
    this.state = { ready: false };
  }

  async componentDidMount() {
    RNNode.start();

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

    this.onReady(() => {
      this.store.dispatch(observationList(''));
      this.store.dispatch(styleList(''));
      this.store.dispatch(presetsList(''));
      this.setState({ ready: true });
    });
  }

  // Ping the rnnodeapp server every 500ms until it responds
  onReady(callback: () => void) {
    const pingServer = () =>
      fetch(API_DOMAIN_URL + '/ready')
        .then(() => callback())
        .catch(() => (this.timeout = setTimeout(pingServer, 500)));
    pingServer();
  }

  handlePositionChange = (position: Position) => {
    this.store.dispatch(locationUpdate(position));
  };

  handlePositionError = (error: PositionError) => {
    this.store.dispatch(locationError(error));
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.loc.stopObserving();
  }

  renderLoading = () => {
    return (
      <Image
        source={SplashScreen}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
      />
    );
  };

  render() {
    if (!this.state.ready || !this.store || !this.persistor) {
      return this.renderLoading();
    }

    return (
      <Provider store={this.store}>
        <PersistGate persistor={this.persistor} loading={this.renderLoading()}>
          <AppNavigation />
        </PersistGate>
      </Provider>
    );
  }
}
