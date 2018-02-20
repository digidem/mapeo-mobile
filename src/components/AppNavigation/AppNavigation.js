// @flow
import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import MainStackNavigation from '@src/components/MainNavigation/MainStackNavigation';

interface Props {
  dispatch: any;
  navigationState: any;
}

const AppNavigation = (props: Props) => (
  <MainStackNavigation
    navigation={addNavigationHelpers({
      dispatch: props.dispatch,
      state: props.navigationState,
      addListener: createReduxBoundAddListener('mainStack')
    })}
  />
);

export default AppNavigation;
