import * as React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableHighlight } from "@gorhom/bottom-sheet";

import { LIGHT_BLUE, MAPEO_BLUE, WHITE } from "../../lib/styles";
import Button from "../../sharedComponents/Button";
import Text from "../../sharedComponents/Text";

interface ActionButtonConfig {
  onPress: () => void;
  text: React.ReactNode;
}

interface Props {
  primary: ActionButtonConfig;
  secondary: ActionButtonConfig;
}

const ModalActionButtons = ({ primary, secondary }: Props) => (
  <View style={styles.buttonsContainer}>
    <Button
      TouchableComponent={props => (
        <TouchableHighlight {...props} underlayColor={WHITE} />
      )}
      onPress={secondary.onPress}
      style={styles.button}
      variant="outlined"
    >
      <Text style={[styles.buttonText, styles.bold, { color: MAPEO_BLUE }]}>
        {secondary.text}
      </Text>
    </Button>
    <View style={styles.spacer} />
    <Button
      TouchableComponent={props => (
        <TouchableHighlight {...props} underlayColor={LIGHT_BLUE} />
      )}
      onPress={primary.onPress}
      style={styles.button}
    >
      <Text style={[styles.buttonText, styles.bold, { color: WHITE }]}>
        {primary.text}
      </Text>
    </Button>
  </View>
);

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
  },
  spacer: { width: 12 },
  bold: { fontWeight: "700" },
});

export default ModalActionButtons;
