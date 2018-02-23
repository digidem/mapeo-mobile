// @flow
import { connect } from 'react-redux';
import { StoreState } from '@types/redux';
import ObservationEditor from './ObservationEditor';
import type { Props, StateProps } from './ObservationEditor';

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  return {
    category:
      (state.app.categories &&
        state.app.categories[ownProps.navigation.state.params.category]) ||
      undefined
  };
}

export default connect(mapStateToProps)(ObservationEditor);
