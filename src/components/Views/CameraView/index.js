// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { observationUpdate } from '../../../ducks/observations';
import type { StoreState } from '../../../types/redux';
import CameraView from './CameraView';
import type { StateProps, DispatchProps } from './CameraView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToObservationEditor: () =>
      dispatch(NavigationActions.navigate({ routeName: 'ObservationEditor' }))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraView);
