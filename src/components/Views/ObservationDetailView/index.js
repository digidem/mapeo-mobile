// @flow
import { connect } from 'react-redux';
import { StoreState } from '@types/redux';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps } from './ObservationDetailView';

function mapStateToProps(state: StoreState): StateProps {
  return { observations: state.app.observations };
}

export default connect(mapStateToProps)(ObservationDetailView);
