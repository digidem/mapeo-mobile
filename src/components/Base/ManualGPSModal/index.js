// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import ManualGPSModal from './ManualGPSModal';

const mapStateToProps = state => ({
  visible: state.modals.manualGPS,
  gpsStatus: state.gps.status
});

export default connect(mapStateToProps)(ManualGPSModal);
