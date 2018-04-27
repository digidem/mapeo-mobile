// @flow
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

const TabBarNavigation = require('./TabBarNavigation');
// import TabBarNavigation from './TabBarNavigation';

const mapStateToProps = state => ({
  navigationState: state.tabBar,
  selectedObservation: state.app.selectedObservation
});

export default connect(mapStateToProps)(withNavigationFocus(TabBarNavigation));
