// @flow
import React from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import memoize from "memoize-one";

import ObservationListItem from "./ObservationListItem";
import type {
  Observation,
  ObservationsMap
} from "../../context/ObservationsContext";
import type { PresetsContext } from "../../context/PresetsContext";

const OBSERVATION_CELL_HEIGHT = 80;

const getItemLayout = (data, index) => ({
  length: OBSERVATION_CELL_HEIGHT,
  offset: OBSERVATION_CELL_HEIGHT * index,
  index
});

const getValuesMemoized = memoize(
  (map): Observation[] =>
    Array.from(map.values()).sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1
    )
);

const keyExtractor = item => item.id.toString();

type Props = {
  loading: boolean,
  error?: Error,
  // A map of observations, by id
  observations: ObservationsMap,
  // Called when the user presses a list item, called with observation id
  onPressObservation: (id: string) => any,
  // A function called with an observation value that returns a preset that
  // matches the observation, used for rendering the icon and title
  getPreset: $ElementType<PresetsContext, "getPreset">
};

/**
 * Renders a list view of observations
 */
const ObservationsListView = ({
  loading,
  error,
  observations,
  onPressObservation,
  getPreset
}: Props) => {
  const rowsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / OBSERVATION_CELL_HEIGHT
  );
  const observationsArray = getValuesMemoized(observations);

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text>
          Cargando... puede demorar varios minutors después de la primera
          sincronización
        </Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text>
          Error a cargar observaciones, volver a abrir Mapeo para ver si corrige
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={rowsPerWindow}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        style={styles.container}
        scrollViewContent={styles.scrollViewContent}
        windowSize={3}
        removeClippedSubviews
        renderItem={({ item }) => {
          const { id, created_at } = item;
          const { icon, name } = getPreset(item.value) || {};
          return (
            <ObservationListItem
              key={id}
              id={id}
              style={styles.listItem}
              name={name}
              iconId={icon}
              createdDate={created_at ? new Date(created_at) : undefined}
              onPress={onPressObservation}
            />
          );
        }}
        data={observationsArray}
      />
    </View>
  );
};

export default ObservationsListView;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  listItem: {
    height: OBSERVATION_CELL_HEIGHT
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  }
});
