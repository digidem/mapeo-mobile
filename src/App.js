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
import RNNode from 'react-native-node';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import 'rxjs';
import { configureStore } from './lib/store';
import AppNavigation from './components/AppNavigation';
import RNReactNativeLocale from 'react-native-locale-listener';
import RNRestart from 'react-native-restart';

export default class App extends React.PureComponent<null, null> {
  changeLayout(language: string) {
    RNRestart.Restart();
  }

  componentDidMount() {
    RNNode.start();
    RNReactNativeLocale.addLocaleListener(this.changeLayout);
  }

  componentWillUnmount() {
    RNReactNativeLocale.removeLocaleListener(this.changeLayout);
  }

  render() {
    const { store, persistor } = configureStore();

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppNavigation />
        </PersistGate>
      </Provider>
    );
  }
}
