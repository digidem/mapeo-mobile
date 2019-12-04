// @flow
import * as React from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { Transition, Transitioning } from "react-native-reanimated";

import useDeviceId from "../../hooks/useDeviceId";
import ObservationListItem from "./ObservationListItem";
import type { Observation } from "../../context/ObservationsContext";
import type { Status } from "../../types";

const m = defineMessages({
  loading: {
    id: "screens.ObservationsList.loading",
    defaultMessage:
      "Loading… this can take a while after synchronizing with a new device",
    description: "message shown whilst observations are loading"
  },
  error: {
    id: "screens.ObservationsList.error",
    defaultMessage:
      "Error loading observations. Try quitting and restarting Mapeo.",
    description:
      "message shown when there is an unexpected error when loading observations"
  }
});

const OBSERVATION_CELL_HEIGHT = 80;

const getItemLayout = (data, index) => ({
  length: OBSERVATION_CELL_HEIGHT,
  offset: OBSERVATION_CELL_HEIGHT * index,
  index
});

const keyExtractor = item => item.id.toString();

const duration = 2500;
const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={duration} />
    <Transition.Out type="fade" durationMs={duration} />
  </Transition.Together>
);

const ObservationLoader = React.memo(() => {
  const { height, width } = Dimensions.get("window");
  const rows = Array(Math.ceil(height / OBSERVATION_CELL_HEIGHT)).fill(null);

  return (
    <ContentLoader
      height={height}
      width={width}
      speed={1}
      secondaryColor="#0432ff">
      {rows.map<React.Node>((_, idx) => (
        <React.Fragment key={idx}>
          <Rect
            x="20"
            y={20 + OBSERVATION_CELL_HEIGHT * idx}
            width={random(60, 120)}
            height="22"
          />
          <Rect
            x="20"
            y={47 + OBSERVATION_CELL_HEIGHT * idx}
            width={random(120, 150)}
            height="14"
          />
          <Circle cx="357" cy={40 + OBSERVATION_CELL_HEIGHT * idx} r="25" />
        </React.Fragment>
      ))}
    </ContentLoader>
  );
});

type Props = {
  status: Status,
  // Array of observations
  observations: Observation[],
  // Called when the user presses a list item, called with observation id
  onPressObservation: (id: string) => any
};

/**
 * Renders a list view of observations
 */
const ObservationsListView = ({
  status,
  observations,
  onPressObservation,
  getPreset
}: Props) => {
  const rowsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / OBSERVATION_CELL_HEIGHT
  );
  const deviceId = useDeviceId();
  const transitionRef = React.useRef();
  const sortedObservations = React.useMemo(
    () => observations.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    [observations]
  );

  React.useEffect(() => {
    if (status === "loading" && transitionRef.current)
      transitionRef.current.animateNextTransition();
  }, [status]);

  if (transitionRef.current) {
    transitionRef.current.animateNextTransition();
  }

  return (
    <Transitioning.View
      style={styles.container}
      ref={transitionRef}
      transition={transition}>
      {status === "loading" ? (
        <ObservationLoader />
      ) : status === "error" ? (
        <View style={styles.messageContainer}>
          <Text>
            <FormattedMessage {...m.error} />
          </Text>
        </View>
      ) : (
        <FlatList
          initialNumToRender={rowsPerWindow}
          getItemLayout={getItemLayout}
          keyExtractor={keyExtractor}
          style={styles.container}
          scrollViewContent={styles.scrollViewContent}
          windowSize={3}
          removeClippedSubviews
          renderItem={({ item }) => {
            return (
              <ObservationListItem
                key={item.id}
                observationId={item.id}
                deviceId={deviceId}
                style={styles.listItem}
                onPress={onPressObservation}
              />
            );
          }}
          data={sortedObservations}
        />
      )}
    </Transitioning.View>
  );
};

export default ObservationsListView;

function random(min = 0, max = 1) {
  return Math.random() * (max = min) + min;
}

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
    height: OBSERVATION_CELL_HEIGHT,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  }
});
