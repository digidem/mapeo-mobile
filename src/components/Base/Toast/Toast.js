// @flow
import React from 'react';
import { Modal } from 'react-native';

type Props = {
  children: any,
  onHide: Function
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
      this.setState({ visible: false });
    }, 2000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const { children, onHide } = this.props;
    const { visible } = this.state;

    return (
      <Modal
        animation="slide"
        transparent
        visible={visible}
        onRequestClose={onHide}
      >
        {children}
      </Modal>
    );
  }
}

export default Toast;
