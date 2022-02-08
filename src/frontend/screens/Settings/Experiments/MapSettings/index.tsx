import React, { useContext, useState } from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { NavigationStackScreenComponent } from "react-navigation-stack";

import HeaderTitle from "../../../../sharedComponents/HeaderTitle";
import IconButton from "../../../../sharedComponents/IconButton";
import { BackIcon } from "../../../../sharedComponents/icons";
import {
  List,
  ListItem,
  ListItemText,
} from "../../../../sharedComponents/List";
import { DirectionalArrow } from "./DirectionalArrow";
import { Menu } from "./Menu";

const m = defineMessages({
  mapSettingTitle: {
    id: "screens.Settings.Experiments.MapSettings.mapSettingTitle",
    defaultMessage: "Map Settings",
  },
  directionalArrow: {
    id: "screens.Settings.Experiments.MapSettings.directionalArrow",
    defaultMessage: "Use Directional Arrow",
  },
  active: {
    id: "screens.Settings.Experiments.MapSettings.active",
    defaultMessage: "Use Directional Arrow",
  },
  inactive: {
    id: "screens.Settings.MapSettings.inactive",
    defaultMessage: "Use Directional Arrow",
  },
});

//When there are more map settings, we can add it to this component as a screen state
export enum MapSettingState {
  Menu,
  DirectionalArrow,
}

export const MapSettings: NavigationStackScreenComponent = () => {
  const [screen, setScreen] = useState(MapSettingState.Menu);

  if (screen === MapSettingState.DirectionalArrow) {
    return <DirectionalArrow />;
  }

  return <Menu setScreen={setScreen} />;
};

MapSettings.navigationOptions = () => ({
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.mapSettingTitle} />
    </HeaderTitle>
  ),
  headerLeft: ({ onPress }) =>
    onPress && (
      <IconButton onPress={onPress}>
        <BackIcon />
      </IconButton>
    ),
});
