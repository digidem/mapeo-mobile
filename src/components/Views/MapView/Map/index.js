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
import NavigationService from '../../../AppNavigation/NavigationService';

const mapStateToProps = (state: StoreState): StateProps => ({
  observations: state.app.observations,
  selectedObservation: state.app.selectedObservation,
  gps: state.app.gps.data
});

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    listObservations: () => dispatch(observationList('')),
    createObservation: observation => dispatch(observationCreate(observation)),
    goToCategories: () =>
      NavigationService.navigate({
        routeName: 'Categories',
        key: 'CategoriesView'
      }),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    selectObservation: o => dispatch(observationSelect(o)),
    goToObservationDetail: () =>
      NavigationService.navigate({ routeName: 'ObservationDetailView' }),
    updateObservationSource: () => dispatch(observationSource('map'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
