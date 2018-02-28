// @flow
import { connect } from 'react-redux';
import { StoreState } from '@types/redux';
import type { Dispatch } from 'redux';
import { NavigationActions } from 'react-navigation';
import { observationAdd } from '@ducks/observations';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps, DispatchProps } from './ObservationDetailView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    observations: state.app.observations,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addObservation: observation => dispatch(observationAdd(observation)),
    goToTabNav: () =>
      dispatch(NavigationActions.navigate({ routeName: 'TabBarNavigation' }))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ObservationDetailView
);
