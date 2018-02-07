// @flow
import { connect } from 'react-redux';
import TabBarNavigation from './TabBarNavigation';

const mapStateToProps = state => ({
  navigationState: state.tabBar,
});

export default connect(mapStateToProps)(TabBarNavigation);
