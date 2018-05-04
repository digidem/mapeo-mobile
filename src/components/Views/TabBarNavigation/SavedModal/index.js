// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import SavedModal from './SavedModal';
import { observationSelect } from '../../../../ducks/observations';
import { modalHide } from '../../../../ducks/modals';
import { observationSelect } from '../../../../ducks/observations';

const mapStateToProps = state => ({
  selectedObservation: state.app.selectedObservation
});

const mapDispatchToProps = dispatch => ({
  onHide: () => {
    dispatch(modalHide('saved'));
    dispatch(observationSelect(undefined));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedModal);
