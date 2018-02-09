// @flow
import { connect } from 'react-redux';
import AppNavigation from './AppNavigation';

const mapStateToProps = state => ({
  navigationState: state.mainStack,
});

export default connect(mapStateToProps)(AppNavigation);
