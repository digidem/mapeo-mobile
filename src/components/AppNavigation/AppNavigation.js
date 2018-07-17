// @flow
import React from 'react';
import { BackHandler, AppState, Dimensions, Image, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import MainStackNavigation from '../MainNavigation/MainStackNavigation';
import SplashScreen from '../../images/splash-screen.png';

interface State {
  showSplash: boolean;
  appState: any;
}

interface StateProps {
  appReady: boolean;
}

class AppNavigation extends React.PureComponent<StateProps, State> {
  state = {
    appState: AppState.currentState,
    showSplash: true
  };

  componentDidMount() {
    const { appReady } = this.props;

    AppState.addEventListener('change', this.handleAppStateChange);
    this.timeout = setTimeout(() => this.setState({ showSplash: false }), 500);

    if (!appReady) {
      clearTimeout(this.timeout);
    }
  }

  componentWillReceiveProps(nextProps: StateProps) {
    const { showSplash } = this.state;

    if (showSplash && nextProps.appReady) {
      this.setState({ showSplash: false });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout: any;

  handleAppStateChange = (nextAppState: State) => {
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
        <MainStackNavigation />
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
