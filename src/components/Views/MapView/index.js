// @flow
import { connect } from 'react-redux';
import MapView from './MapView';
import { drawerClose, drawerOpen } from '../../../ducks/drawers';
import { observationList } from '../../../ducks/observations';

const mapStateToProps = state => ({
  showSavedModal: state.modals.saved
});

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onDrawerClose: () => dispatch(drawerClose('observations')),
  onDrawerOpen: () => dispatch(drawerOpen('observations')),
  listObservations: () => dispatch(observationList(''))
});

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
