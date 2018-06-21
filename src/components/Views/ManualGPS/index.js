// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import ManualGPS from './ManualGPS';
import type { StoreState } from '../../../types/redux';
import type { DispatchProps, StateProps } from './ManualGPS';
import { observationUpdate } from '../../../ducks/observations';
import { gpsFormatSettingsSet } from '../../../ducks/settings';
import { modalShow } from '../../../ducks/modals';

const mapStateToProps = (state: StoreState): StateProps => ({
  gpsFormat: state.app.settings.gpsFormat,
  selectedObservation: state.app.selectedObservation,
  observationSource: state.app.observationSource.source
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  goBack: () => dispatch(NavigationActions.back()),
  updateObservation: observation => dispatch(observationUpdate(observation)),
  setGPSFormat: format => dispatch(gpsFormatSettingsSet(format)),
  goToMapView: () =>
    dispatch(NavigationActions.navigate({ routeName: 'MapView' })),
  goToCameraView: () =>
    dispatch(
      NavigationActions.navigate({
        routeName: 'CameraView',
        params: { showEditorView: false }
      })
    ),
  showSavedModal: () => dispatch(modalShow('saved'))
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualGPS);
