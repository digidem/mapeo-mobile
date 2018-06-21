// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';

import {
  observationUpdate,
  observationSelect,
  observationSave
} from '../../../ducks/observations';
import { modalHide, modalShow } from '../../../ducks/modals';
import ObservationEditor from './ObservationEditor';
import type { Props, StateProps, DispatchProps } from './ObservationEditor';
import NavigationService from '../../AppNavigation/NavigationService';

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
      NavigationService.navigate({
        routeName: 'PhotoView',
        params: { photoSource: source }
      }),
    goToCameraView: () =>
      NavigationService.navigate({
        routeName: 'CameraView',
        params: { showEditorView: true }
      }),
    goToMainCameraView: () =>
      NavigationService.navigate({
        routeName: 'CameraView',
        params: { showEditorView: false }
      }),
    goToCategories: () =>
      NavigationService.navigate({
        routeName: 'Categories',
        key: 'CategoriesView'
      }),
    goToObservationFields: () =>
      NavigationService.navigate({
        routeName: 'ObservationFields'
      }),
    goBack: () => {
      dispatch(NavigationService.back());
    },
    goToMapView: () =>
      NavigationService.navigate({
        routeName: 'MapView'
      }),
    showSavedModal: () => dispatch(modalShow('saved')),
    showCancelModal: () => dispatch(modalShow('cancelled')),
    hideCancelModal: () => dispatch(modalHide('cancelled')),
    hideManualGPSModal: () => dispatch(modalHide('manualGPS')),
    showManualGPSModal: () => dispatch(modalShow('manualGPS')),
    saveObservation: () => dispatch(observationSave(null))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationEditor);
