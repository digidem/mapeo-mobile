// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
import { StoreState } from '../../../types/redux';
import { categoryList } from '../../../ducks/categories';
import { observationUpdate } from '../../../ducks/observations';
import Categories from './Categories';
import type { StateProps } from './Categories';

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
    goToObservationEditor: category =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ObservationEditor',
          params: {
            category
          }
        })
      ),
    goBack: () => dispatch(NavigationActions.back())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(Categories)
);
