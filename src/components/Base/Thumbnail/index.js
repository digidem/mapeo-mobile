// @flow
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';
import type { Props, StateProps } from './Thumbnail';
import Thumbnail from './Thumbnail';

const mapStateToProps = (state: StoreState, ownProps: Props) => {
  return {
    attachment: state.attachments[ownProps.attachmentId]
  };
};

export default connect(mapStateToProps)(Thumbnail);
