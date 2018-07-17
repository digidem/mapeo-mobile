// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';
import {
  observationUpdate,
  observationSelect,
  observationSave,
  observationUpdateSave
} from '../../../ducks/observations';
import { modalHide, modalShow } from '../../../ducks/modals';
import { mediaResize } from '../../../ducks/media';
import ObservationEditor from './ObservationEditor';
import type { Props, StateProps, DispatchProps } from './ObservationEditor';

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  const category = state.selectedObservation
    ? state.categories[state.selectedObservation.categoryId]
    : undefined;

  return {
    category:
      (state.categories &&
        ownProps.navigation.state &&
        ownProps.navigation.state.params &&
        ownProps.navigation.state.params.category &&
        state.categories[ownProps.navigation.state.params.category]) ||
      category,
    selectedObservation: state.selectedObservation,
    observations: values(state.observations),
    observationSource: state.observationSource.source,
    cancelModalVisible: state.modals.cancelled,
    gps: state.gps,
    manualGPSModalVisible: state.modals.manualGPS,
    gpsFormat: state.settings.gpsFormat,
    icons: state.icons
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    clearSelectedObservation: () => dispatch(observationSelect(undefined)),
    showCancelModal: () => dispatch(modalShow('cancelled')),
    hideCancelModal: () => dispatch(modalHide('cancelled')),
    hideManualGPSModal: () => dispatch(modalHide('manualGPS')),
    showManualGPSModal: () => dispatch(modalShow('manualGPS')),
    saveObservation: (update: boolean) => {
      if (update) {
        dispatch(observationUpdateSave(null));
      } else {
        dispatch(observationSave(null));
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationEditor);
