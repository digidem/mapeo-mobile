// @flow
import React from 'react';
import { Modal } from 'react-native';

type Props = {
  children: any,
  onRequestClose?: Function,
  onHide?: Function
};

type State = {
  visible: boolean
};

class Toast extends React.PureComponent<Props, State> {
  state = { visible: true };
  timer: any;

  componentDidMount() {
    const { onHide } = this.props;
    this.timer = setTimeout(() => {
      this.setState({ visible: false }, () => {
        if (onHide) {
          onHide();
        }
      });
    }, 2000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const { children, onRequestClose } = this.props;
    const { visible } = this.state;

    return (
      <Modal
        animation="slide"
        transparent
        visible={visible}
        onRequestClose={onRequestClose || (() => {})}
      >
        {children}
      </Modal>
    );
  }
}

export default Toast;
