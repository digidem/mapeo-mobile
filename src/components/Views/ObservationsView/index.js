// @flow
import { connect } from 'react-redux';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import { observationSelect } from '../../../ducks/observations';
import { mediaResize } from '../../../ducks/media';
import ObservationsView from './ObservationsView';
import type { StateProps, DispatchProps } from './ObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  const observations = values(state.observations).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const drawerOpened = state.drawers.observations;
  return {
    drawerOpened,
    observations,
    categories: state.categories,
    icons: state.icons
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return {
    selectObservation: o => dispatch(observationSelect(o))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationsView);
