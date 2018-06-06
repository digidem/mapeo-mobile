// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';

import { observationAdd, observationUpdate } from '../../../ducks/observations';
import { modalShow } from '../../../ducks/modals';
import ObservationEditor from './ObservationEditor';
import type { Props, StateProps, DispatchProps } from './ObservationEditor';

function mapStateToProps(state: StoreState, ownProps: Props): StateProps {
  return {
    category:
      (state.app.categories &&
        ownProps.navigation.state &&
        ownProps.navigation.state.params &&
        ownProps.navigation.state.params.category &&
        state.app.categories[ownProps.navigation.state.params.category]) ||
      undefined,
    selectedObservation: state.app.selectedObservation,
    observations: values(state.app.observations),
    observationSource: state.app.observationSource.source
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addObservation: observation => dispatch(observationAdd(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToPhotoView: source =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'PhotoView',
          params: { photoSource: source }
        })
      ),
    goToCameraView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'CameraView',
          params: { source: 'editor' }
        })
      ),
    goToMainCameraView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'CameraView'
        })
      ),
    goToCategories: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'Categories',
          key: 'CategoriesView'
        })
      ),
    goToObservationFields: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ObservationFields'
        })
      ),
    goBack: () => {
      dispatch(NavigationActions.back());
    },
    goToMapView: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MapView'
        })
      ),
    showSavedModal: () => dispatch(modalShow('saved'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationEditor);
