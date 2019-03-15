// @flow
import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import type { NavigationScreenProp } from "react-navigation";

// import I18n from 'react-native-i18n';

import ObservationCell from "./ObservationCell";
// import moment from '../../../lib/localizedMoment';
import memoize from "memoize-one";

type Props = {
  closeRightDrawer: Function,
  navigation: NavigationScreenProp<*>
};

// I18n.fallbacks = true;
// I18n.translations = {
//   en: require("../../translations/en"),
//   es: require("../../translations/es")
// };

const t = require("../../translations/en");

const OBSERVATION_CELL_HEIGHT = 80;

const getItemLayout = (data, index) => ({
  length: OBSERVATION_CELL_HEIGHT,
  offset: OBSERVATION_CELL_HEIGHT * index,
  index
});

const getValuesMemoized = memoize(obj => Object.values(obj));

const keyExtractor = item => item.id.toString();

const ObservationsList = ({ observations, onPressObservation }) => {
  const itemsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / OBSERVATION_CELL_HEIGHT
  );
  const observationsArray = getValuesMemoized(observations);
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <FlatList
        initialNumToRender={
          itemsPerWindow * 2 /** always render a screens worth extra */
        }
        getItemLayout={getItemLayout}
        style={{ width: Dimensions.get("window").width }}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <ObservationCell observation={item} onPress={onPressObservation} />
        )}
        data={observationsArray}
      />
    </View>
  );
};

export default ObservationsList;
