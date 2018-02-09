// @flow
import { connect } from 'react-redux';
import { StoreState } from '@types/redux';
import MyObservationsView from './MyObservationsView';
import type { StateProps } from './MyObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  return { observations: state.app.observations };
}

export default connect(mapStateToProps)(MyObservationsView);
