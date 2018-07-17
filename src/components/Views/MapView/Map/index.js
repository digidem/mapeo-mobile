// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import {
  observationCreate,
  observationUpdate,
  observationSelect
} from '../../../../ducks/observations';
import { observationSource } from '../../../../ducks/observationSource';
import { StoreState } from '../../../../types/redux';
import Map from './Map';
import type { DispatchProps, StateProps } from './Map';

const mapStateToProps = (state: StoreState) => ({
  observations: state.observations,
  selectedObservation: state.selectedObservation,
  coords: state.gps.coords,
  selectedStyle: state.map.selectedStyle
});

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return {
    createObservation: observation => dispatch(observationCreate(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    selectObservation: o => dispatch(observationSelect(o)),
    updateObservationSource: () => dispatch(observationSource('map'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
