// @flow
import React from 'react';
import { Modal } from 'react-native';

type Props = {
  children: any,
  onRequestClose?: Function,
  onHide?: Function,
  visible?: boolean
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.visible !== prevState.visible) {
      this.setState({ visible: this.props.visible });
    }
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
