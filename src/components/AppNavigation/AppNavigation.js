// @flow
import React from 'react';
import { BackHandler } from 'react-native';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import MainStackNavigation from '../MainNavigation/MainStackNavigation';

interface Props {
  dispatch: any;
  navigationState: any;
}

class AppNavigation extends React.PureComponent<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, navigationState } = this.props;
      if (this.shouldCloseApp(navigationState)) return false;
      dispatch(NavigationActions.back());
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  shouldCloseApp = (nav: any) => nav.index === 0;

  render() {
    return (
      <MainStackNavigation
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.navigationState,
          addListener: createReduxBoundAddListener('mainStack')
        })}
      />
    );
  }
}

export default AppNavigation;
