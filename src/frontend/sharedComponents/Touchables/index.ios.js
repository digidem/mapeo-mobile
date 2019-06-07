import React from "react";
import { TouchableHighlight } from "react-native";

export { Touchable, TouchableHighlight, TouchableOpacity } from "react-native";

const TouchableNativeFeedback = props => <TouchableHighlight {...props} />;

TouchableNativeFeedback.Ripple = () => {};

export { TouchableNativeFeedback };
