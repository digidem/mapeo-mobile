import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { List, ListItem, ListItemText } from "../../../sharedComponents/List";

const m = defineMessages({
  backgroundMaps: {
    id: "screens.Settings.MapSettings.backgroundMaps",
    defaultMessage: "Map Settings",
  },
  dataLayers: {
    id: "screens.Settings.MapSettings.dataLayers",
    defaultMessage: "Data Layers",
  },
});

export const MapSettings: NavigationStackScreenComponent = () => {
  const { navigate } = useNavigation();

  return (
    <View>
      <List>
        <ListItem
          onPress={() => {
            navigate("");
          }}
        >
          <ListItemText
            primary={<FormattedMessage {...m.backgroundMaps} />}
            secondary={"---------"}
          />
        </ListItem>
        {/* TO DO: Uncomment out whenpage has been added */}
        {/* <ListItem
                    onPress={()=>{navigate("")}}
                >
                    <ListItemText 
                        primary={<FormattedMessage {...m.dataLayers} />}
                        secondary={"---------"}
                    />
                </ListItem> */}
      </List>
    </View>
  );
};
