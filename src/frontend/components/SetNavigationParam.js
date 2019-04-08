import React from "react";
import { withNavigation } from "react-navigation";
class SetParam extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      [this.props.name]: this.props.value
    });
  }
  render() {
    return null;
  }
}

export default withNavigation(SetParam);
