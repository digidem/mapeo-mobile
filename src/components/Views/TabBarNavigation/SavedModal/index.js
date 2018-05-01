// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import SavedModal from './SavedModal';
import { modalHide } from '../../../../ducks/modals';

const mapStateToProps = state => ({
  selectedObservation: state.app.selectedObservation
});

const mapDispatchToProps = dispatch => ({
  onHide: () => dispatch(modalHide('saved'))
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedModal);
