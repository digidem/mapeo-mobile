// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { observationUpdate } from '../../../ducks/observations';

import type { StoreState } from '../../../types/redux';
import PhotoView from './PhotoView';
import type { StateProps, DispatchProps, Props } from './PhotoView';

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  const id = ownProps.navigation.getParam('photoId', '');

  return {
    selectedObservation: state.app.selectedObservation,
    attachment: id ? state.app.attachments[id] : undefined
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoView);
