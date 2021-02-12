// @flow
import React, { useMemo } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import Text from "../../sharedComponents/Text";
import { defineMessages, FormattedMessage } from "react-intl";
import { useNavigation } from "react-navigation-hooks";
import ObservationListItem from "./ObservationListItem";
import ObservationEmptyView from "./ObservationsEmptyView";
import type { Observation } from "../../context/ObservationsContext";

const m = defineMessages({
  loading: {
    id: "screens.ObservationsList.loading",
    defaultMessage:
      "Loading… this can take a while after synchronizing with a new device",
    description: "message shown whilst observations are loading",
  },
  error: {
    id: "screens.ObservationsList.error",
    defaultMessage:
      "Error loading observations. Try quitting and restarting Mapeo.",
    description:
      "message shown when there is an unexpected error when loading observations",
  },
});

const OBSERVATION_CELL_HEIGHT = 80;

const getItemLayout = (data, index) => ({
  length: OBSERVATION_CELL_HEIGHT,
  offset: OBSERVATION_CELL_HEIGHT * index,
  index,
});

const keyExtractor = item => item.id.toString();

type Props = {
  loading: boolean,
  error?: boolean,
  // Array of observations
  observations: Observation[],
  // Called when the user presses a list item, called with observation id
  onPressObservation: (id: string) => any,
};

/**
 * Renders a list view of observations
 */
const ObservationsListView = ({
  loading,
  error,
  observations,
  onPressObservation,
}: Props) => {
  const navigation = useNavigation();
  const rowsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / OBSERVATION_CELL_HEIGHT
  );

  const sortedObservations = useMemo(
    () => observations.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    [observations]
  );
  if (!observations.length) {
    return (
      <ObservationEmptyView onPressBack={() => navigation.navigate("Map")} />
    );
  }
  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text>
          <FormattedMessage {...m.loading} />
        </Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text>
          <FormattedMessage {...m.error} />
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="observationsListView">
      <FlatList
        initialNumToRender={rowsPerWindow}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        style={styles.container}
        scrollViewContent={styles.scrollViewContent}
        windowSize={3}
        removeClippedSubviews
        renderItem={({ item, index }) => {
          return (
            <ObservationListItem
              key={item.id}
              testID={`observationListItem:${index}`}
              observationId={item.id}
              style={styles.listItem}
              onPress={onPressObservation}
            />
          );
        }}
        data={sortedObservations}
      />
    </View>
  );
};

export default ObservationsListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  listItem: {
    height: OBSERVATION_CELL_HEIGHT,
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});
