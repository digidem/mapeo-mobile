// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { observationUpdate } from '../../../ducks/observations';
import type { StoreState } from '../../../types/redux';
import CameraView from './CameraView';
import type { StateProps, DispatchProps } from './CameraView';

const resetAction = NavigationActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'ObservationEditor' }),
    NavigationActions.navigate({ routeName: 'CameraView' })
  ]
});

function mapStateToProps(state: StoreState): StateProps {
  return {
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToObservationEditor: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ObservationEditor'
        })
      ),
    resetNavigation: () => dispatch(resetAction)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraView);
