// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import { values } from 'lodash';
import { StoreState } from '../../../types/redux';
import { fieldList } from '../../../ducks/fields';
import { observationAdd, observationUpdate } from '../../../ducks/observations';
import ObservationFields from './ObservationFields';
import type { Props, StateProps, DispatchProps } from './ObservationFields';

function mapStateToProps(state: StoreState): StateProps {
  return {
    allFields: values(state.app.fields),
    selectedObservation: state.app.selectedObservation
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    addObservation: observation => dispatch(observationAdd(observation)),
    updateObservation: observation => dispatch(observationUpdate(observation)),
    goBack: () => dispatch(NavigationActions.back())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ObservationFields);
