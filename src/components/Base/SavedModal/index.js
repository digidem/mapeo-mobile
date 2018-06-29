// @flow
import { connect } from 'react-redux';

import SavedModal from './SavedModal';
import { modalHide } from '../../../ducks/modals';
import { observationSelect } from '../../../ducks/observations';
import { observationSource } from '../../../ducks/observationSource';

const mapStateToProps = state => ({
  selectedObservation: state.app.selectedObservation,
  categories: state.app.categories,
  gpsFormat: state.app.settings.gpsFormat,
  icons: state.app.icons
});

const mapDispatchToProps = dispatch => ({
  onHide: () => {
    dispatch(modalHide('saved'));
    dispatch(observationSelect(undefined));
    dispatch(observationSource(undefined));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedModal);
