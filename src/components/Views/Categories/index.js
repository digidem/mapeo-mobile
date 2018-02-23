// @flow
import { connect } from 'react-redux';
import { StoreState } from '@types/redux';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { categoryList } from '@ducks/categories';
import Categories from './Categories';
import type { StateProps } from './Categories';

function mapStateToProps(state: StoreState): StateProps {
  const categories = values(state.app.categories).sort(
    (a, b) => a.name - b.name
  );

  return { categories };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { listCategories: () => dispatch(categoryList('')) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
