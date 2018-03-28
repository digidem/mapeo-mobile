// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { NavigationActions } from 'react-navigation';
import { StoreState } from '../../../types/redux';
import { categoryList } from '../../../ducks/categories';
import { observationUpdate } from '../../../ducks/observations';
import Categories from './Categories';
import type { StateProps } from './Categories';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: 'TabBarNavigation'
    }),
    NavigationActions.navigate({
      routeName: 'Categories'
    })
  ]
});

function mapStateToProps(state: StoreState): StateProps {
  const categories = values(state.app.categories).sort(
    (a, b) => a.name - b.name
  );

  return {
    categories,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    listCategories: () => dispatch(categoryList('')),
    resetNavigation: () => dispatch(resetAction)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
