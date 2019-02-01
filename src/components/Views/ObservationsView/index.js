// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import { observationSelect } from '../../../ducks/observations';
import ObservationsView from './ObservationsView';
import type { StateProps, DispatchProps } from './ObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    categories: state.categories,
    icons: state.icons
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return {
    selectObservation: o => dispatch(observationSelect(o))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationsView);
