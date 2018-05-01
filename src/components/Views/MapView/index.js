// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import {
  observationList,
  observationCreate,
  observationUpdate,
  observationSelect
} from '../../../ducks/observations';

import { StoreState } from '../../../types/redux';
import MapView from './MapView';
import type { DispatchProps, StateProps } from './MapView';

const mapStateToProps = (state: StoreState): StateProps => ({
  observations: state.app.observations
});

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    listObservations: () => dispatch(observationList('')),
    createObservation: observation => dispatch(observationCreate(observation)),
    goToCategories: () =>
      dispatch(NavigationActions.navigate({ routeName: 'Categories' })),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    selectObservation: o => dispatch(observationSelect(o)),
    goToObservationDetail: () =>
      dispatch(
        NavigationActions.navigate({ routeName: 'ObservationDetailView' })
      )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
