// @flow
import { connect } from 'react-redux';
import NavigationService from '../../AppNavigation/NavigationService';
import type { Dispatch } from 'redux';
import ManualGPSModal from './ManualGPSModal';
import type { DispatchProps } from './ManualGPSModal';

const mapStateToProps = state => ({
  visible: state.app.modals.manualGPS,
  gps: state.app.gps
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  goToManualEnter: () =>
    NavigationService.navigate({ routeName: 'ManualGPSView' })
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualGPSModal);
