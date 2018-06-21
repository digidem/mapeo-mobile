// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import ManualGPSModal from './ManualGPSModal';
import type { DispatchProps } from './ManualGPSModal';

const mapStateToProps = state => ({
  visible: state.app.modals.manualGPS,
  gps: state.app.gps
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  goToManualEnter: () =>
    dispatch(NavigationActions.navigate({ routeName: 'ManualGPSView' }))
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualGPSModal);
