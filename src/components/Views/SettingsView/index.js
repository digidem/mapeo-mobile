// @flow
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import type { Dispatch } from 'redux';
import SettingsView from './SettingsView';
import type { StoreState } from '../../../types/redux';
import type { StateProps, DispatchProps } from './SettingsView';
import { gpsFormatSettingsSet } from '../../../ducks/settings';

function mapStateToProps(state: StoreState): StateProps {
  return {
    gpsFormat: state.app.settings.gpsFormat
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    goBack: () => dispatch(NavigationActions.back()),
    setGPSFormat: format => dispatch(gpsFormatSettingsSet(format))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
