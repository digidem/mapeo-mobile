import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { ScrollView } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";
import { List, ListItem, ListItemText } from "../../../sharedComponents/List";

const m = defineMessages({
  backgroundMaps: {
    id: "screens.Settings.MapSettings.backgroundMaps",
    defaultMessage: "Background Maps",
  },
  dataLayers: {
    id: "screens.Settings.MapSettings.dataLayers",
    defaultMessage: "Data Layers",
  },
  mapSettings: {
    id: "screens.Settings.MapSettings.mapSettings",
    defaultMessage: "Map Settings",
  },
});

export const MapSettings: NavigationStackScreenComponent = () => {
  const { navigate } = useNavigation();

  return (
    <ScrollView>
      <List>
        <ListItem
          onPress={() => {
            navigate("BackgroundMaps");
          }}
        >
          <ListItemText
            primary={<FormattedMessage {...m.backgroundMaps} />}
            secondary={"---------"}
          />
        </ListItem>
      </List>
    </ScrollView>
  );
};

MapSettings.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.mapSettings} />
    </HeaderTitle>
  ),
};
