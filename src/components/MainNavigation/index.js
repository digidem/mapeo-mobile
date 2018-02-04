import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import MainStackNavigation from './MainStackNavigation';

const mapStateToProps = state => {
  return { navigationState: state.NavigationReducer };
};

class AppNavigation extends React.Component {
  render() {
    const { navigationState, dispatch } = this.props;
    return(
      <MainStackNavigation
        navigation={addNavigationHelpers({ dispatch, state: navigationState })}
      />
    );
  }
}

export default connect(mapStateToProps)(AppNavigation);