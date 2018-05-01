// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { observationUpdate } from '../../../ducks/observations';
import type { StoreState } from '../../../types/redux';
import Position from './Position';
import type { StateProps, DispatchProps } from './Position';

function mapStateToProps(state: StoreState): StateProps {
  return { selectedObservation: state.app.selectedObservation };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Position);
