// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';

import {
  observationUpdate,
  observationSelect
} from '../../../ducks/observations';
import { modalHide, modalShow } from '../../../ducks/modals';
import ObservationEditor from './ObservationEditor';
import type { Props, StateProps, DispatchProps } from './ObservationEditor';

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  return {
    category:
      (state.app.categories &&
        ownProps.navigation.state &&
        ownProps.navigation.state.params &&
        ownProps.navigation.state.params.category &&
        state.app.categories[ownProps.navigation.state.params.category]) ||
      undefined,
    selectedObservation: state.app.selectedObservation,
    observations: values(state.app.observations),
    observationSource: state.app.observationSource.source,
    cancelModalVisible: state.app.modals.cancelled,
    gps: state.app.gps,
    manualGPSModalVisible: state.app.modals.manualGPS
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    clearSelectedObservation: () => dispatch(observationSelect(undefined)),
    goToPhotoView: source =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: { photoSource: source }
        })
      ),
    goToCameraView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'CameraView',
          params: { showEditorView: true }
        })
      ),
    goToMainCameraView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'CameraView',
          params: { showEditorView: false }
        })
      ),
    goToCategories: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'Categories',
          key: 'CategoriesView'
        })
      ),
    goToObservationFields: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ObservationFields'
        })
      ),
    goBack: () => {
      dispatch(NavigationActions.back());
    },
    goToMapView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MapView'
        })
      ),
    showSavedModal: () => dispatch(modalShow('saved')),
    showCancelModal: () => dispatch(modalShow('cancelled')),
    hideCancelModal: () => dispatch(modalHide('cancelled')),
    hideManualGPSModal: () => dispatch(modalHide('manualGPS')),
    showManualGPSModal: () => dispatch(modalShow('manualGPS'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationEditor);
