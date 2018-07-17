// @flow
import { connect } from 'react-redux';
import MapView from './MapView';
import { drawerClose, drawerOpen } from '../../../ducks/drawers';

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onDrawerClose: () => dispatch(drawerClose('observations')),
  onDrawerOpen: () => dispatch(drawerOpen('observations'))
});

export default connect(null, mapDispatchToProps)(MapView);
