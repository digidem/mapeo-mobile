// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import ManualGPSModal from './ManualGPSModal';
import type { DispatchProps } from './ManualGPSModal';

const mapStateToProps = state => ({
  visible: state.app.modals.manualGPS,
  gps: state.app.gps
});

export default connect(mapStateToProps)(ManualGPSModal);
