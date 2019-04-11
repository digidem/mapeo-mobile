// @flow
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Text
} from "react-native";
import memoize from "memoize-one";
// import debug from "debug";

import ObservationIcon from "./ObservationIcon";
import Circle from "./Circle";
import type { PresetsMap, Preset } from "../context/PresetsContext";

const ROW_HEIGHT = 120;
const MIN_COL_WIDTH = 100;
// const log = debug("CategoriesView");

const styles = StyleSheet.create({
  cellContainer: {
    flex: 1,
    alignItems: "center",
    height: ROW_HEIGHT,
    paddingTop: 15,
    paddingBottom: 15
  },
  categoryName: {
    color: "black",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5
  }
});

type Props = {
  presets: PresetsMap,
  onSelect: (preset: Preset) => void
};

// Sort presets by sort property and then by name, then filter only point presets
const getPresetsList = memoize((presets: PresetsMap) =>
  Array.from(presets.values())
    .sort((a, b) => {
      if (typeof a.sort !== "undefined" && typeof b.sort !== "undefined") {
        return a.sort - b.sort;
      } else {
        return (a.name || "").localeCompare(b.name);
      }
    })
    .filter(p => p.geometry.includes("point"))
);

const getItemLayout = (data, index) => ({
  length: ROW_HEIGHT,
  offset: ROW_HEIGHT * index,
  index
});

const keyExtractor = item => item.id;

class CategoriesView extends React.Component<Props> {
  renderItem = ({ item }: { item: Preset }) => (
    <TouchableOpacity
      style={styles.cellContainer}
      onPress={() => this.props.onSelect(item)}
    >
      <Circle>
        <ObservationIcon iconId={item.icon} size="medium" />
      </Circle>
      <Text numberOfLines={3} style={styles.categoryName}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  render() {
    const presetsList = getPresetsList(this.props.presets);
    const rowsPerWindow = Math.ceil(
      (Dimensions.get("window").height - 65) / ROW_HEIGHT
    );
    const numColumns = Math.floor(
      Dimensions.get("window").width / MIN_COL_WIDTH
    );
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          initialNumToRender={rowsPerWindow}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          style={{ width: Dimensions.get("window").width }}
          renderItem={this.renderItem}
          data={presetsList}
          numColumns={numColumns}
        />
      </View>
    );
  }
}
export default CategoriesView;
