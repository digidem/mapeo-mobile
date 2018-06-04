// @flow
import { connect } from 'react-redux';

import MapView from './MapView';
import { drawerClose, drawerOpen } from '../../../ducks/drawers';

const mapStateToProps = state => ({
  showSavedModal: state.app.modals.saved
});

const mapDispatchToProps = dispatch => ({
  onDrawerClose: () => dispatch(drawerClose('observations')),
  onDrawerOpen: () => dispatch(drawerOpen('observations'))
});

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
