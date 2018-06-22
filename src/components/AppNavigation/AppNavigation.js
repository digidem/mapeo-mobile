// @flow
import React from 'react';
import { BackHandler, AppState, Dimensions, Image, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import MainStackNavigation from '../MainNavigation/MainStackNavigation';
import SplashScreen from '../../images/splash-screen.png';
import NavigationService from './NavigationService';

interface State {
  showSplash: boolean;
  appState: any;
}

class AppNavigation extends React.PureComponent<{}, State> {
  state = {
    appState: AppState.currentState,
    showSplash: true
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.timeout = setTimeout(() => this.setState({ showSplash: false }), 500);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout: any;

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState &&
      this.state.appState.match(/background/) &&
      nextAppState === 'active'
    ) {
      this.setState({ showSplash: true }, () => {
        this.timeout = setTimeout(
          () => this.setState({ showSplash: false }),
          1000
        );
      });
    }
    this.setState({ appState: nextAppState });
  };

  shouldCloseApp = (nav: any) => nav.index === 0;

  render() {
    const { showSplash } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MainStackNavigation
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
        {showSplash && (
          <Image
            source={SplashScreen}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height
            }}
          />
        )}
      </View>
    );
  }
}

export default AppNavigation;
