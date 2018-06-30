// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';
import { observationUpdate } from '../../../ducks/observations';
import ObservationFields from './ObservationFields';
import type { Props, StateProps, DispatchProps } from './ObservationFields';

function mapStateToProps(state: StoreState): StateProps {
  return {
    allFields: state.app.fields,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addObservation: observation => dispatch(observationUpdate(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationFields);
