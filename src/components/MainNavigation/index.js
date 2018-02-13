import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import MainStackNavigation from '@src/components/MainNavigation/MainStackNavigation';

class AppWithNavigationState extends React.Component {
  render() {
    const { dispatch, nav } = this.props;

    return (
      <MainStackNavigation
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);