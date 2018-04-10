// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import { observationSelect } from '../../../ducks/observations';
import ObservationsView from './ObservationsView';
import type { StateProps, DispatchProps } from './ObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  const observations = values(state.app.observations).sort(
    (a, b) => b.created - a.created
  );

  return { observations };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    selectObservation: o => dispatch(observationSelect(o)),
    goToObservationDetail: () =>
      dispatch(
        NavigationActions.navigate({ routeName: 'ObservationDetailView' })
      )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationsView);
