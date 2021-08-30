import * as React from "react";
import { StyleSheet, View } from "react-native";

import { LIGHT_GREY } from "../../../lib/styles";
import Button from "../../../sharedComponents/Button";

export const MemberRow = ({
  addTopBorder,
  buttonText,
  children,
  onButtonPress,
}: React.PropsWithChildren<{
  addTopBorder?: boolean;
  buttonText: React.ReactNode;
  onButtonPress: () => void;
}>) => (
  <View
    style={[
      styles.container,
      addTopBorder && {
        borderTopWidth: 1,
        borderColor: LIGHT_GREY,
      },
    ]}
  >
    {children}
    <Button variant="text" onPress={onButtonPress}>
      {buttonText}
    </Button>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
