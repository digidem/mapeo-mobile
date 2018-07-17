// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import {
  observationList,
  observationCreate,
  observationUpdate,
  observationSelect
} from '../../../../ducks/observations';
import { observationSource } from '../../../../ducks/observationSource';
import { StoreState } from '../../../../types/redux';
import Map from './Map';
import type { DispatchProps, StateProps } from './Map';
import { styleList } from '../../../../ducks/map';

const mapStateToProps = (state: StoreState): StateProps => ({
  observations: state.observations,
  selectedObservation: state.selectedObservation,
  coords: state.gps.coords,
  selectedStyle: state.map.selectedStyle
});

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    listObservations: () => dispatch(observationList('')),
    createObservation: observation => dispatch(observationCreate(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    selectObservation: o => dispatch(observationSelect(o)),
    updateObservationSource: () => dispatch(observationSource('map')),
    listStyles: () => dispatch(styleList(''))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
