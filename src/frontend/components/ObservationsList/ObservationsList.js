// @flow
import React from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import memoize from "memoize-one";

import ObservationListItem from "./ObservationListItem";
import type {
  Observation,
  ObservationsMap
} from "../../context/ObservationsContext";
import type { PresetWithFields } from "../../context/PresetsContext";

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
  (map): Observation[] => Array.from(map.values())
);

const keyExtractor = item => item.id.toString();

type Props = {
  observations: ObservationsMap,
  onPressObservation: (id: string, params: {}) => any,
  getPreset: Observation => PresetWithFields | void
};

const ObservationsList = ({
  observations,
  onPressObservation,
  getPreset
}: Props) => {
  const itemsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / OBSERVATION_CELL_HEIGHT
  );
  const observationsArray = getValuesMemoized(observations);
  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={
          itemsPerWindow * 2 /** always render a screens worth extra */
        }
        getItemLayout={getItemLayout}
        style={{ width: Dimensions.get("window").width }}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => {
          const { id, createdAt } = item;
          const { icon, name } = getPreset(item) || {};
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
