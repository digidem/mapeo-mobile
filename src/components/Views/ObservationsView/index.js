// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import { observationSelect } from '../../../ducks/observations';
import { categoryList } from '../../../ducks/categories';
import { fieldList } from '../../../ducks/fields';
import ObservationsView from './ObservationsView';
import type { StateProps, DispatchProps } from './ObservationsView';
import NavigationService from '../../AppNavigation/NavigationService';

function mapStateToProps(state: StoreState): StateProps {
  const observations = values(state.app.observations).sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const drawerOpened = state.app.drawers.observations;
  return { drawerOpened, observations, categories: state.app.categories };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    selectObservation: o => dispatch(observationSelect(o)),
    goToObservationDetail: () =>
      NavigationService.navigate({ routeName: 'ObservationDetailView' }),
    goToSyncView: () => NavigationService.navigate({ routeName: 'SyncView' }),
    goToSettings: () =>
      NavigationService.navigate({ routeName: 'SettingsView' }),
    listCategories: () => {
      dispatch(categoryList(''));
      dispatch(fieldList(''));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(ObservationsView)
);
