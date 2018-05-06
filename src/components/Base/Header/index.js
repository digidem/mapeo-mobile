// @flow
import { connect } from 'react-redux';
import { StoreState } from '../../../types/redux';
import Header from './Header';
import type { StateProps } from './Header';

const mapStateToProps = (state: StoreState): StateProps => ({
  gps: state.app.gps
});

export default connect(mapStateToProps, null)(Header);
