// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import TabBarNavigation from './TabBarNavigation';

const mapStateToProps = state => ({
  selectedObservation: state.app.selectedObservation
});

export default connect(mapStateToProps)(TabBarNavigation);
