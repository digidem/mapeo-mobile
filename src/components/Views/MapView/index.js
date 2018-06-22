// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import MapView from './MapView';
import { drawerClose, drawerOpen } from '../../../ducks/drawers';
import { observationList } from '../../../ducks/observations';

const mapStateToProps = state => ({
  showSavedModal: state.app.modals.saved
});

const mapDispatchToProps = dispatch => ({
  onDrawerClose: () => dispatch(drawerClose('observations')),
  onDrawerOpen: () => dispatch(drawerOpen('observations')),
  listObservations: () => dispatch(observationList(''))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(MapView)
);
