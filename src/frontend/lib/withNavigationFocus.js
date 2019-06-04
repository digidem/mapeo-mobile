import React from "react";
import { AppState } from "react-native";
import hoistStatics from "hoist-non-react-statics";
import { withNavigation } from "react-navigation";

/**
 * This Higher Order Component (HOC) that provides an `isFocussed` prop to the
 * wrapped component, similar to
 * [`withNavigationFocus`](https://reactnavigation.org/docs/en/with-navigation-focus.html)
 * from `react-navigation` but in contrast to that, this one considers the
 * screen to be focussed until it finishes animating out, as opposed to until
 * when is starts animating out,
 * _AND_ if the app moves into the background, isFocused is false
 */
export default function withFocus(Component) {
  class ComponentWithFocus extends React.Component {
    static displayName = `withFocus(${Component.displayName ||
      Component.name})`;

    constructor(props) {
      super(props);

      this.state = {
        isNavigationFocused: props.navigation
          ? props.navigation.isFocused()
          : false,
        isAppActive: AppState.currentState === "active"
      };
    }

    componentDidMount() {
      const { navigation } = this.props;
      this.subscriptions = [
        navigation.addListener("didFocus", () =>
          this.setState({ isNavigationFocused: true })
        ),
        navigation.addListener("didBlur", () =>
          this.setState({ isNavigationFocused: false })
        )
      ];
      AppState.addEventListener("change", this.handleAppStateChange);
    }

    handleAppStateChange = nextAppState => {
      this.setState({
        isAppActive: nextAppState === "active"
      });
    };

    componentWillUnmount() {
      this.subscriptions.forEach(sub => sub.remove());
      AppState.removeEventListener("change", this.handleAppStateChange);
    }

    render() {
      const { isNavigationFocused, isAppActive } = this.state;
      return (
        <Component
          {...this.props}
          isFocused={isNavigationFocused && isAppActive}
          ref={this.props.onRef}
        />
      );
    }
  }

  return hoistStatics(
    withNavigation(ComponentWithFocus, { forwardRef: false }),
    Component
  );
}
