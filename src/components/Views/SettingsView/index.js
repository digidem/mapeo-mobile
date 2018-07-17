// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import SettingsView from './SettingsView';
import type { StoreState } from '../../../types/redux';
import type { StateProps, DispatchProps } from './SettingsView';
import { gpsFormatSettingsSet } from '../../../ducks/settings';
import { styleSelect } from '../../../ducks/map';

function mapStateToProps(state: StoreState): StateProps {
  return {
    gpsFormat: state.settings.gpsFormat,
    selectedStyle: state.map.selectedStyle,
    styles: state.map.styles
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return {
    setGPSFormat: format => dispatch(gpsFormatSettingsSet(format)),
    setSelectedStyle: style => dispatch(styleSelect(style))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
