// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { withNavigationFocus } from 'react-navigation';
import { StoreState } from '../../../types/redux';

import {
  observationUpdate,
  observationSelect,
  observationSave,
  observationUpdateSave
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
    manualGPSModalVisible: state.app.modals.manualGPS,
    gpsFormat: state.app.settings.gpsFormat
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
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

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(ObservationEditor)
);
