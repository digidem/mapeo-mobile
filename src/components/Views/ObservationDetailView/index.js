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
    selectedObservation: state.selectedObservation,
    categories: state.categories,
    gpsFormat: state.settings.gpsFormat,
    icons: state.icons
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    clearSelectedObservation: () => dispatch(observationSelect(undefined)),
    updateObservationSource: () => dispatch(observationSource('detail'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ObservationDetailView
);
