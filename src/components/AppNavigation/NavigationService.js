// @flow

import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(args: Object) {
  _navigator.dispatch(NavigationActions.navigate(args));
}

function back() {
  _navigator.dispatch(NavigationActions.back());
}

// add other navigation functions that you need and export them

export default {
  navigate,
  back,
  setTopLevelNavigator
};
