// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import CancelModal from './CancelModal';

const mapDispatchToProps = dispatch => ({
  goBack: () => {
    dispatch(NavigationActions.back());
  }
});

export default connect(mapDispatchToProps)(CancelModal);
