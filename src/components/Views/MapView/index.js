// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import {
  observationList,
  observationCreate,
  observationUpdate
} from '../../../ducks/observations';

import { StoreState } from '../../../types/redux';
import MapView from './MapView';
import type { DispatchProps, StateProps } from './MapView';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'TabBarNavigation' })]
});

const mapStateToProps = (state: StoreState): StateProps => ({
  observations: state.app.observations
});

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    listObservations: () => dispatch(observationList('')),
    createObservation: observation => dispatch(observationCreate(observation)),
    resetNavigation: () => dispatch(resetAction),
    goToPosition: () =>
      dispatch(NavigationActions.navigate({ routeName: 'Position' })),
    updateObservation: observation => dispatch(observationUpdate(observation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
