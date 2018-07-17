// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';
import { observationUpdate } from '../../../ducks/observations';
import FieldInput from './FieldInput';
import type { StateProps } from './FieldInput';

function mapStateToProps(state: StoreState): StateProps {
  return {
    selectedObservation: state.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FieldInput);
