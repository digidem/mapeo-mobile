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
import { mediaResize } from '../../../ducks/media';
import ObservationsView from './ObservationsView';
import type { StateProps, DispatchProps } from './ObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  const observations = values(state.observations).sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const drawerOpened = state.drawers.observations;
  return {
    drawerOpened,
    observations,
    categories: state.categories,
    icons: state.icons,
    resizedImages: state.resizedImages
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    selectObservation: o => dispatch(observationSelect(o)),
    listCategories: () => {
      dispatch(categoryList(''));
      dispatch(fieldList(''));
    },
    listObservations: () => dispatch(observationList('')),
    getResizedImage: source => dispatch(mediaResize(source))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(ObservationsView)
);
