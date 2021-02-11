// @flow
import React, { useContext } from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
} from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";

import ConfigContext, { type Preset } from "../context/ConfigContext";
import HeaderTitle from "../sharedComponents/HeaderTitle";
import useDraftObservation from "../hooks/useDraftObservation";
import { CategoryCircleIcon } from "../sharedComponents/icons";

import type { NavigationProp } from "../types";

const m = defineMessages({
  categoryTitle: {
    id: "screens.CategoryChooser.categoryTitle",
    defaultMessage: "Choose what is happening",
    description: "Title for category chooser screen",
  },
});

// Used to skip static message extraction for messages without a static ID
const DynFormattedMessage = FormattedMessage;

const ROW_HEIGHT = 120;
const MIN_COL_WIDTH = 100;
// const log = debug("CategoriesView");

const getItemLayout = (data, index) => ({
  length: ROW_HEIGHT,
  offset: ROW_HEIGHT * index,
  index,
});

const keyExtractor = item => item.id;

const Item = React.memo(
  ({
    item,
    onSelect,
  }: {
    item: Preset,
    onSelect: (preset: Preset) => void,
  }) => (
    <TouchableHighlight
      style={styles.cellTouchable}
      onPress={() => onSelect(item)}
      activeOpacity={1}
      underlayColor="#000033"
      testID={`${item.id}CategoryButton`}
    >
      <View style={styles.cellContainer}>
        <CategoryCircleIcon iconId={item.icon} size="medium" />
        <Text numberOfLines={3} style={styles.categoryName}>
          <DynFormattedMessage
            id={`presets.${item.id}.name`}
            defaultMessage={item.name}
          />
        </Text>
      </View>
    </TouchableHighlight>
  )
);

const CategoryChooser = ({ navigation }: { navigation: NavigationProp }) => {
  const [{ presets }] = useContext(ConfigContext);
  const [{ value: draftValue }, { updateDraft }] = useDraftObservation();
  const presetsList = Array.from(presets.values())
    // Sort presets by sort property and then by name, then filter only point presets
    .sort(presetCompare)
    // Only show presets where the geometry property includes "point"
    .filter(p => p.geometry.includes("point"));
  const handleSelectPreset = (selectedPreset: Preset) => {
    // Tags from current preset
    const currentDraftTags = (draftValue || {}).tags || {};
    // Tags from previous preset
    const prevPresetTags =
      (presets.get(currentDraftTags.categoryId) || {}).tags || {};
    // Create object with new tags only
    const draftTags = Object.keys(currentDraftTags).reduce(
      (previous, current) => {
        // Check if tag belongs to previous preset
        const tagIsFromPrevPreset =
          typeof currentDraftTags[current] !== "undefined" &&
          currentDraftTags[current] === prevPresetTags[current];
        // If belongs to previous preset, ignore it
        if (tagIsFromPrevPreset) return previous;
        // Else, include in new object
        return {
          ...previous,
          [current]: currentDraftTags[current],
        };
      },
      {}
    );
    updateDraft({
      tags: {
        ...draftTags,
        ...selectedPreset.tags,
        categoryId: selectedPreset.id,
      },
    });
    navigation.navigate("ObservationEdit");
  };

  const renderItem = ({ item }) => (
    <Item key={keyExtractor(item)} item={item} onSelect={handleSelectPreset} />
  );

  const rowsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / ROW_HEIGHT
  );
  const numColumns = Math.floor(Dimensions.get("window").width / MIN_COL_WIDTH);

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
        renderItem={renderItem}
        data={presetsList}
        numColumns={numColumns}
      />
    </View>
  );
};

CategoryChooser.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.categoryTitle} />
    </HeaderTitle>
  ),
};

export default CategoryChooser;

// Sort presets by sort property and then by name, then filter only point presets
function presetCompare(a, b) {
  if (typeof a.sort !== "undefined" && typeof b.sort !== "undefined") {
    // If sort value is the same, then sort by name
    if (a.sort === b.sort) return compareStrings(a.name, b.name);
    // Lower sort numbers come before higher numbers
    else return a.sort - b.sort;
  } else if (typeof a.sort !== "undefined") {
    // If a has a sort field but b doesn't, a comes first
    return -1;
  } else if (typeof b.sort !== "undefined") {
    // if b has a sort field but a doesn't, b comes first
    return 1;
  } else {
    // if neither have sort defined, compare by name
    return compareStrings(a.name, b.name);
  }
}

function compareStrings(a = "", b = "") {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    flex: 1,
  },
  cellTouchable: {
    flex: 1,
    height: ROW_HEIGHT,
    marginBottom: 5,
    borderRadius: 10,
  },
  cellContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "white",
  },
  categoryName: {
    color: "black",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
