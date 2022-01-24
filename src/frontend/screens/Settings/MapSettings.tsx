import React, { useContext } from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { View, Text, Switch } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import SettingsContext from "../../context/SettingsContext";
import {
  DARK_BLUE,
  LIGHT_BLUE,
  VERY_LIGHT_BLUE,
  LIGHT_GREY,
} from "../../lib/styles";

import HeaderTitle from "../../sharedComponents/HeaderTitle";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon } from "../../sharedComponents/icons";
import { List, ListItem, ListItemText } from "../../sharedComponents/List";

const m = defineMessages({
  mapSettingTitle: {
    id: "screens.Settings.MapSettings.mapSettingTitle",
    defaultMessage: "Map Settings",
  },
  directionalArrow: {
    id: "screens.Settings.MapSettings.directionalArrow",
    defaultMessage: "Use Directional Arrow",
  },
  batteryWarning: {
    id: "screens.Settings.MapSettings.batteryWarning",
    defaultMessage: "May drain battery faster",
  },
});

export const MapSettings: NavigationStackScreenComponent = () => {
  const [{ directionalArrow }, setSetting] = useContext(SettingsContext);
  return (
    <List>
      <ListItem
        onPress={() => setSetting("directionalArrow", !directionalArrow)}
      >
        <ListItemText
          primary={<FormattedMessage {...m.directionalArrow} />}
          secondary={<FormattedMessage {...m.batteryWarning} />}
        />
        <Switch
          trackColor={{ false: LIGHT_GREY }}
          thumbColor={directionalArrow ? DARK_BLUE : LIGHT_GREY}
          value={directionalArrow}
        />
      </ListItem>
    </List>
  );
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

const useArrowListItem = () => {};
