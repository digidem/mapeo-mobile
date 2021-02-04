/* eslint-disable react-native/no-raw-text */
// @flow
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Text from "../../sharedComponents/Text";
import { defineMessages, useIntl } from "react-intl";
import { ObservationListIcon } from "../../sharedComponents/icons";

import Button from "../../sharedComponents/Button";

const { width } = Dimensions.get("window");

const m = defineMessages({
  noObservationsTitle: {
    id: "screens.ObservationsList.ObservationsEmptyView.noObservationsTitle",
    description:
      "Title of observation list view when the user has not yet recorded observations",
    defaultMessage: "Add Observations",
  },
  noObservationsDesc: {
    id: "screens.ObservationsList.ObservationsEmptyView.noObservationsDesc",
    description:
      "Description of observation list view when the user has not yet recorded observations",
    defaultMessage:
      "Start from map or camera view to record your first observation.",
  },
  backButton: {
    id: "screens.ObservationsList.ObservationsEmptyView.backButton",
    description:
      "Back button on observation list screen when no observations are yet recorded",
    defaultMessage: "Go To Map",
  },
});

type Props = {
  onPressBack: () => any,
};

const ObservationEmptyView = ({ onPressBack }: Props) => {
  const { formatMessage: t } = useIntl();
  return (
    <View style={styles.root} testID="observationsEmptyView">
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <ObservationListIcon size={150} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.infoHeader, styles.text]}>
          {t(m.noObservationsTitle)}
        </Text>
        <Text style={[styles.infoSubheader, styles.text]}>
          {t(m.noObservationsDesc)}
        </Text>
      </View>
      <View style={styles.backButton}>
        <Button onPress={onPressBack} variant="outlined" color="light">
          {t(m.backButton)}
        </Button>
      </View>
    </View>
  );
};

export default ObservationEmptyView;

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    flex: 1,
  },
  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 0,
  },
  iconCircle: {
    width: width - 125,
    height: width - 125,
    backgroundColor: "#CCE0FF",
    borderRadius: (width - 125) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  infoHeader: {
    fontWeight: "700",
    fontSize: 24,
  },
  infoSubheader: {
    fontWeight: "400",
    fontSize: 18,
  },
  textContainer: {
    flex: 0,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    textAlign: "center",
    color: "#888888",
  },
  backButton: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
