import React from "react";
import hoistStatics from "hoist-non-react-statics";
import { withNavigation } from "react-navigation";

/**
 * This Higher Order Component (HOC) that provides an `isFocussed` prop to the
 * wrapped component, similar to
 * [`withNavigationFocus`](https://reactnavigation.org/docs/en/with-navigation-focus.html)
 * from `react-navigation` but in contrast to that, this one considers the
 * screen to be focussed until it finishes animating out, as opposed to until
 * when is starts animating out.
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
      return (
        <Component
          {...this.props}
          isFocused={this.state.isFocused}
          ref={this.props.onRef}
        />
      );
    }
  }

  return hoistStatics(
    withNavigation(ComponentWithNavigationFocus, { forwardRef: false }),
    Component
  );
}
