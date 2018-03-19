// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { observationCreate, observationUpdate } from '../../../ducks/observations';
import type { StoreState } from '../../../types/redux';
import CameraTabView from './CameraTabView';
import type { StateProps, DispatchProps } from './CameraTabView';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: 'TabBarNavigation'
    })]
});

function mapStateToProps(state: StoreState): StateProps {
  return {
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    createObservation: observation => dispatch(observationCreate(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToObservationEditor: () =>
      dispatch(NavigationActions.navigate({routeName: 'ObservationEditor' })),
    goToPhotoView: (source) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: { fromCameraTab: true, photoSource: source }
        })
      ),
    resetNavigation: () => dispatch(resetAction)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraTabView);
