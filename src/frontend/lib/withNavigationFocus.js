import React from "react";
import { View } from "react-native";
import hoistStatics from "hoist-non-react-statics";
import { withNavigation } from "react-navigation";

/**
 * This Higher Order Component (HOC) unmounts a component when it looses
 * navigation 'focus' - e.g. it will unmount when you navigate away from it.
 * Unlike the react-navigation `withNavigationFocus` it will unmount on the
 * `didBlur` event instead of `willBlur` - i.e. the unmount will happen at the
 * end of any navigation transition. This is necessary because unmounting the
 * camera component is expensive and can lock-up the transition animation.
 */
export default function withNavigationFocus(Component) {
  class ComponentWithNavigationFocus extends React.Component {
    static displayName = `withNavigationMount(${Component.displayName ||
      Component.name})`;

    constructor(props) {
      super(props);

      this.state = {
        isFocused: props.navigation ? props.navigation.isFocused() : false
      };
    }

    componentDidMount() {
      const { navigation } = this.props;
      this.subscriptions = [
        navigation.addListener("didFocus", () =>
          this.setState({ isFocused: true })
        ),
        navigation.addListener("didBlur", () =>
          this.setState({ isFocused: false })
        )
      ];
    }

    componentWillUnmount() {
      this.subscriptions.forEach(sub => sub.remove());
    }

    render() {
      return this.state.isFocused ? (
        <Component
          {...this.props}
          isFocused={this.state.isFocused}
          ref={this.props.onRef}
        />
      ) : (
        <View />
      );
    }
  }

  return hoistStatics(
    withNavigation(ComponentWithNavigationFocus, { forwardRef: false }),
    Component
  );
}
