// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import TabBarNavigation from './TabBarNavigation';

const mapStateToProps = state => ({
    showSavedModal: state.app.modals.saved
  });

export default connect(mapStateToProps)(TabBarNavigation);
