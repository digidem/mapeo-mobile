// @flow

import { AsyncStorage } from 'react-native';

const HAS_LAUNCHED = 'hasLaunched';

function setAppLaunched() {
  AsyncStorage.setItem(HAS_LAUNCHED, 'true');
}

export default async function checkIfFirstLaunch() {
  try {
    const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
    if (hasLaunched === null) {
      setAppLaunched();
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}