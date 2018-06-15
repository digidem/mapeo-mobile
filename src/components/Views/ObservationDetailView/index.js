// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { NavigationActions } from 'react-navigation';
import { StoreState } from '../../../types/redux';

import { observationAdd } from '../../../ducks/observations';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps, DispatchProps } from './ObservationDetailView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    observations: state.app.observations,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addObservation: observation => dispatch(observationAdd(observation)),
    goToEditorView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ObservationEditor'
        })
      ),
    goToPhotoView: params =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: {
            fromDetailView: params.fromDetailView,
            photoType: params.type,
            photoSource: params.source
          }
        })
      ),
    goBack: () => dispatch(NavigationActions.back())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ObservationDetailView
);
