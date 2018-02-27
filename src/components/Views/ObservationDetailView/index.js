// @flow
import { connect } from 'react-redux';
import { StoreState } from '@types/redux';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps } from './ObservationDetailView';
import type { Dispatch } from 'redux';
import { observationUpdate } from '@ducks/observations';

function mapStateToProps(state: StoreState): StateProps {
  return {
    observations: state.app.observations,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationDetailView);
