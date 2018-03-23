// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import { observationAdd, observationUpdate } from '../../../ducks/observations';
import ObservationEditor from './ObservationEditor';
import type { Props, StateProps, DispatchProps } from './ObservationEditor';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: 'TabBarNavigation',
      params: { showModal: true },
    })
  ]
});

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  return {
    category:
      (state.app.categories &&
        ownProps.navigation.state &&
        ownProps.navigation.state.params &&
        ownProps.navigation.state.params.category &&
        state.app.categories[ownProps.navigation.state.params.category]) ||
      undefined,
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addObservation: observation => dispatch(observationAdd(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToPhotoView: (source) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: { photoSource: source }
        })
      ),
    resetNavigation: () => dispatch(resetAction)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationEditor);
