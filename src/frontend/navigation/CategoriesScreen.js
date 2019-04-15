// @flow
import React from "react";

import CategoriesView from "../components/CategoriesView";
import PresetsContext from "../context/PresetsContext";
import { withDraft } from "../context/DraftObservationContext";

import type { DraftObservationContext } from "../context/DraftObservationContext";
import type { Preset } from "../context/PresetsContext";
import type { NavigationScreenConfigProps } from "react-navigation";

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  draft: DraftObservationContext
};

class CategoriesScreen extends React.Component<Props> {
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

export default withDraft()(CategoriesScreen);
