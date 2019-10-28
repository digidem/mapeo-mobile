// @flow
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { defineMessages, useIntl } from "react-intl";

import { TouchableHighlight } from "../../sharedComponents/Touchables";
import useObservation from "../../hooks/useObservation";
import { CategoryCircleIcon } from "../../sharedComponents/icons";
import DateDistance from "../../sharedComponents/DateDistance";
import type { Style } from "../../types";

const m = defineMessages({
  defaultObservationName: {
    id: "screens.ObservationsList.ObservationListItem.defaultObservationName",
    defaultMessage: "Observation",
    description: "Default name for an observation that does not match a preset"
  }
});

type Props = {
  onPress: string => any,
  style?: Style<typeof View>,
  observationId: string
};

const ObservationListItem = ({
  onPress = () => {},
  style,
  observationId
}: Props) => {
  const { formatMessage: t } = useIntl();
  const [{ observation, preset }] = useObservation(observationId);
  const name = preset ? preset.name : t(m.defaultObservationName);
  const iconId = preset && preset.icon;
  const createdDate =
    observation && observation.created_at
      ? new Date(observation.created_at)
      : undefined;
  return (
    <TouchableHighlight
      onPress={() => onPress(observationId)}
      testID={"ObservationListItem:" + observationId}
      style={{ flex: 1, height: 80 }}>
      <View style={[styles.container, style]}>
        <View style={styles.text}>
          <Text style={styles.title}>{name}</Text>
          {createdDate && <DateDistance date={createdDate} />}
        </View>
        <CategoryCircleIcon iconId={iconId} size="medium" />
      </View>
    </TouchableHighlight>
  );
};

export default React.memo<Props>(ObservationListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    width: "100%",
    paddingHorizontal: 20,
    flex: 1,
    height: 80
  },
  text: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  title: { fontSize: 18, fontWeight: "700", color: "black" }
  // media: { width: 60, height: 60, borderRadius: 7 }
});
