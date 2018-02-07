// @flow
import { connect } from 'react-redux';
import { observationList } from '@ducks/observations';
import type { Dispatch } from 'redux';
import { StoreState } from '@types/redux';
import MapView from './MapView';
import type { DispatchProps, StateProps } from './MapView';

function mapStateToProps(state: StoreState): StateProps {
  return { observations: state.observations };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return { listObservations: () => dispatch(observationList('')) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
