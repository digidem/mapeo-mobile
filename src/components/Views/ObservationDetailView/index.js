// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { NavigationActions } from 'react-navigation';
import { StoreState } from '../../../types/redux';

import { observationAdd } from '../../../ducks/observations';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps, DispatchProps } from './ObservationDetailView';

const resetAction = NavigationActions.navigate({
  routeName: 'TabBarNavigation',
  params: {},
  actions: [
    NavigationActions.navigate({
      routeName: 'CameraView',
      params: { showCancelButton: false }
    })
  ]
});

function mapStateToProps(state: StoreState): StateProps {
  return {
    observations: state.app.observations,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addObservation: observation => dispatch(observationAdd(observation)),
    goToPhotoView: source =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: { photoSource: source }
        })
      ),
    resetNavigation: () => dispatch(resetAction)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ObservationDetailView
);
