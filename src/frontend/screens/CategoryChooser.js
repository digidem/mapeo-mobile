// @flow
import React from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  FlatList,
  Text
} from "react-native";
import memoize from "memoize-one";
// import debug from "debug";

import PresetsContext from "../context/PresetsContext";
import { withDraft } from "../context/DraftObservationContext";
import { CategoryCircleIcon } from "../sharedComponents/icons";

import type { DraftObservationContext } from "../context/DraftObservationContext";
import type { NavigationScreenConfigProps } from "react-navigation";
import type { PresetsMap, Preset } from "../context/PresetsContext";

const ROW_HEIGHT = 120;
const MIN_COL_WIDTH = 100;
// const log = debug("CategoriesView");

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

const Item = ({
  item,
  onSelect
}: {
  item: Preset,
  onSelect: (preset: Preset) => void
}) => (
  <TouchableHighlight
    style={styles.cellTouchable}
    onPress={() => onSelect(item)}
    activeOpacity={1}
    underlayColor="#000033"
  >
    <View style={styles.cellContainer}>
      <CategoryCircleIcon iconId={item.icon} size="medium" />
      <Text numberOfLines={3} style={styles.categoryName}>
        {item.name}
      </Text>
    </View>
  </TouchableHighlight>
);

const PureItem = React.memo(Item);

export class CategoriesView extends React.PureComponent<Props> {
  render() {
    const { presets, onSelect } = this.props;
    const presetsList = getPresetsList(presets);
    const rowsPerWindow = Math.ceil(
      (Dimensions.get("window").height - 65) / ROW_HEIGHT
    );
    const numColumns = Math.floor(
      Dimensions.get("window").width / MIN_COL_WIDTH
    );
    return (
      <View style={styles.container}>
        <FlatList
          initialNumToRender={rowsPerWindow}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={1}
          maxToRenderPerBatch={numColumns}
          removeClippedSubviews
          style={{ width: Dimensions.get("window").width }}
          renderItem={({ item }) => (
            <PureItem item={item} onSelect={onSelect} />
          )}
          data={presetsList}
          numColumns={numColumns}
        />
      </View>
    );
  }
}

class CategoryChooser extends React.Component<{
  ...$Exact<NavigationScreenConfigProps>,
  draft: DraftObservationContext
}> {
  static navigationOptions = {
    title: "Choose Category"
  };

  handleSelectPreset = (preset: Preset) => {
    const { draft, navigation } = this.props;
    draft.setValue({
      tags: {
        ...draft.value.tags,
        categoryId: preset.id
      }
    });
    navigation.navigate("ObservationEdit");
  };

  render() {
    return (
      <PresetsContext.Consumer>
        {({ presets }) => (
          <CategoriesView
            presets={presets}
            onSelect={this.handleSelectPreset}
          />
        )}
      </PresetsContext.Consumer>
    );
  }
}

export default withDraft()(CategoryChooser);

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    flex: 1
  },
  cellTouchable: {
    flex: 1,
    height: ROW_HEIGHT,
    marginBottom: 5,
    borderRadius: 10
  },
  cellContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "white"
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
