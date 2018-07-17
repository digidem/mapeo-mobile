// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';
import { categoryList } from '../../../ducks/categories';
import {
  observationUpdate,
  observationSelect
} from '../../../ducks/observations';
import { observationSource } from '../../../ducks/observationSource';
import Categories from './Categories';
import type { StateProps } from './Categories';

function mapStateToProps(state: StoreState): StateProps {
  const categories = values(state.categories).sort(
    (a, b) => a.name - b.name
  );
  const { selectedObservation, observations } = state;

  let updateFlow = false;
  if (selectedObservation && observations[selectedObservation.id]) {
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

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    listCategories: () => {
      dispatch(categoryList(''));
    },
    clearSelectedObservation: () => {
      dispatch(observationSelect(undefined));
      dispatch(observationSource(undefined));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
