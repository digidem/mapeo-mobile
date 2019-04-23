// @flow
import React from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import memoize from "memoize-one";

import ObservationListItem from "./ObservationListItem";
import type {
  Observation,
  ObservationsMap
} from "../../context/ObservationsContext";
import type { PresetsContext } from "../../context/PresetsContext";

const OBSERVATION_CELL_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    height: OBSERVATION_CELL_HEIGHT
  }
});

const getItemLayout = (data, index) => ({
  length: OBSERVATION_CELL_HEIGHT,
  offset: OBSERVATION_CELL_HEIGHT * index,
  index
});

const getValuesMemoized = memoize(
  (map): Observation[] =>
    Array.from(map.values()).sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    )
);

const keyExtractor = item => item.id.toString();

type Props = {
  observations: ObservationsMap,
  onPressObservation: (id: string) => any,
  getPreset: $ElementType<PresetsContext, "getPreset">
};

const ObservationsList = ({
  observations,
  onPressObservation,
  getPreset
}: Props) => {
  const rowsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / OBSERVATION_CELL_HEIGHT
  );
  const observationsArray = getValuesMemoized(observations);
  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={rowsPerWindow}
        getItemLayout={getItemLayout}
        style={{ width: Dimensions.get("window").width }}
        keyExtractor={keyExtractor}
        windowSize={3}
        removeClippedSubviews
        renderItem={({ item }) => {
          const { id, createdAt } = item;
          const { icon, name } = getPreset(item.value) || {};
          return (
            <ObservationListItem
              key={id}
              id={id}
              style={styles.listItem}
              title={name}
              iconId={icon}
              subtitle={createdAt}
              onPress={onPressObservation}
            />
          );
        }}
        data={observationsArray}
      />
    </View>
  );
};

export default ObservationsList;
