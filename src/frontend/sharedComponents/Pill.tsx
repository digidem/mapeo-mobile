import * as React from "react";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { View, Text, StyleSheet } from "react-native";

import {
  LIGHT_BLUE,
  LIGHT_GREY,
  MAPEO_BLUE,
  MEDIUM_BLUE,
  WHITE,
} from "../lib/styles";
import { TextStyleProp, ViewStyleProp } from "../sharedTypes";

interface PillProps {
  text: MessageDescriptor;
  containerStyle?: ViewStyleProp;
  textStyle?: TextStyleProp;
}

export const Pill = ({ text, containerStyle, textStyle }: PillProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.text, textStyle]}>
        <FormattedMessage {...text} />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 5,
    backgroundColor: MAPEO_BLUE,
  },
  text: {
    fontSize: 12,
    color: WHITE,
  },
});
