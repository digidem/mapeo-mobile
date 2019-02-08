// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import memoize from 'memoize-one';
import { StoreState } from '../../../types/redux';
import {
  observationUpdate,
  observationSelect
} from '../../../ducks/observations';
import { observationSource } from '../../../ducks/observationSource';
import Categories from './Categories';
import type { StateProps } from './Categories';

const memoizedCategoriesSort = memoize(categories =>
  values(categories).sort((a, b) => a.name - b.name)
);

function mapStateToProps(state: StoreState): StateProps {
  const categories = memoizedCategoriesSort(state.categories);
  const { selectedObservation } = state;

  let updateFlow = false;
  if (selectedObservation && selectedObservation.id === 'NEW_OBSERVATION') {
    updateFlow = true;
  }

  return {
    allFields: state.fields,
    categories,
    selectedObservation,
    updateFlow,
    icons: state.icons
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    clearSelectedObservation: () => {
      dispatch(observationSelect(undefined));
      dispatch(observationSource(undefined));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
