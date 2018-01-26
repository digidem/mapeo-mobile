// @flow
import { connect } from 'react-redux';
import { observationList } from '@ducks/observations';
import type { Dispatch } from 'redux';
import { StoreState } from '@types/redux';
import CameraView from './CameraView';

function mapStateToProps(state: StoreState) {
  return { observations: state[0].observations };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { listObservations: () => dispatch(observationList('')) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraView);
