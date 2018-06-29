// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';
import { observationSource } from '../../../ducks/observationSource';
import {
  observationUpdate,
  observationSelect
} from '../../../ducks/observations';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps, DispatchProps } from './ObservationDetailView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    selectedObservation: state.app.selectedObservation,
    categories: state.app.categories,
    gpsFormat: state.app.settings.gpsFormat
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    clearSelectedObservation: () => dispatch(observationSelect(undefined)),
    updateObservationSource: () => dispatch(observationSource('detail'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ObservationDetailView
);
