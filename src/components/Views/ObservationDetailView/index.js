// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import {
  observationUpdate,
  observationSelect
} from '../../../ducks/observations';
import ObservationDetailView from './ObservationDetailView';
import type { StateProps, DispatchProps } from './ObservationDetailView';
import NavigationService from '../../AppNavigation/NavigationService';

function mapStateToProps(state: StoreState): StateProps {
  return {
    selectedObservation: state.app.selectedObservation,
    categories: state.app.categories
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    goToEditorView: () =>
      NavigationService.navigate({
        routeName: 'ObservationEditor'
      }),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goToPhotoView: params =>
      NavigationService.navigate({
        routeName: 'PhotoView',
        params: {
          fromDetailView: params.fromDetailView,
          photoType: params.type,
          photoSource: params.source
        }
      }),
    goBack: () => NavigationService.back(),
    clearSelectedObservation: () => dispatch(observationSelect(undefined))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ObservationDetailView
);
