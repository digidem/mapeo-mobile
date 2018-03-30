// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import {
  observationCreate,
  observationUpdate
} from '../../../ducks/observations';
import type { StoreState } from '../../../types/redux';
import CameraTabView from './CameraTabView';
import type { StateProps, DispatchProps } from './CameraTabView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    observations: state.app.observations,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    createObservation: observation => dispatch(observationCreate(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToObservationEditor: () =>
      dispatch(NavigationActions.navigate({ routeName: 'ObservationEditor' })),
    goToCategories: () =>
      dispatch(NavigationActions.navigate({ routeName: 'Categories' }))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraTabView);
