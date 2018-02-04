import MainStackNavigation from '@src/components/MainNavigation/MainStackNavigation';
import { NavigationActions } from 'react-navigation';

const initialState = MainStackNavigation.router.getStateForAction(
  NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'NewObservationView '}),
    ],
  })
);
const navigationReducer = (state = initialState, action) => {
  const newState = MainStackNavigation.router.getStateForAction(action, state);
  return newState || state;
};

export default navigationReducer;