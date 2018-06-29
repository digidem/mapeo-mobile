// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import {
  observationSelect,
  observationList
} from '../../../ducks/observations';
import { categoryList } from '../../../ducks/categories';
import { fieldList } from '../../../ducks/fields';
import ObservationsView from './ObservationsView';
import type { StateProps, DispatchProps } from './ObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  const observations = values(state.app.observations).sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const drawerOpened = state.app.drawers.observations;
  return {
    drawerOpened,
    observations,
    categories: state.app.categories,
    icons: state.app.icons
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    selectObservation: o => dispatch(observationSelect(o)),
    listCategories: () => {
      dispatch(categoryList(''));
      dispatch(fieldList(''));
    },
    listObservations: () => dispatch(observationList(''))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(ObservationsView)
);
