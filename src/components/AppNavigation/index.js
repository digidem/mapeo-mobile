// @flow
import { connect } from 'react-redux';
import AppNavigation from './AppNavigation';

const mapStateToProps = state => {
  return {
    appReady: state.appReady
  };
};

export default connect(mapStateToProps)(AppNavigation);
