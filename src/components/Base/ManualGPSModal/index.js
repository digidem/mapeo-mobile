// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import ManualGPSModal from './ManualGPSModal';

const mapStateToProps = state => ({
  visible: state.app.modals.manualGPS,
  gpsStatus: state.app.gps.status
});

export default connect(mapStateToProps)(ManualGPSModal);
