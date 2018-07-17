// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import ManualGPS from './ManualGPS';
import type { StoreState } from '../../../types/redux';
import type { DispatchProps, StateProps } from './ManualGPS';
import {
  observationUpdate,
  observationSave
} from '../../../ducks/observations';
import { gpsFormatSettingsSet } from '../../../ducks/settings';
import { modalShow } from '../../../ducks/modals';

const mapStateToProps = (state: StoreState): StateProps => ({
  gpsFormat: state.settings.gpsFormat,
  selectedObservation: state.selectedObservation,
  observationSource: state.observationSource.source
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  updateObservation: observation => dispatch(observationUpdate(observation)),
  setGPSFormat: format => dispatch(gpsFormatSettingsSet(format)),
  saveObservation: () => dispatch(observationSave())
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualGPS);
