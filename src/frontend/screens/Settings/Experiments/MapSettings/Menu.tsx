import React, { useContext } from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { useNavigation } from "react-navigation-hooks";
import { MapSettingState as Mss } from ".";
import SettingsContext from "../../../../context/SettingsContext";
import {
  List,
  ListItem,
  ListItemText,
} from "../../../../sharedComponents/List";

const m = defineMessages({
  directionalArrow: {
    id: "screens.Settings.MapSettings.Menu.directionalArrow",
    defaultMessage: "Use Directional Arrow",
  },
  active: {
    id: "screens.Settings.Experiments.MapSettings.Menu.active",
    defaultMessage: "Active",
  },
  inactive: {
    id: "screens.Settings.Experiments.MapSettings.Menu.inactive",
    defaultMessage: "Inactive",
  },
});

interface MenuProps {
  setScreen: React.Dispatch<React.SetStateAction<Mss>>;
}

export const Menu = ({ setScreen }: MenuProps) => {
  const [{ directionalArrow }] = useContext(SettingsContext);

  return (
    <List>
      <ListItem
        onPress={() => {
          setScreen(Mss.DirectionalArrow);
        }}
      >
        <ListItemText
          primary={<FormattedMessage {...m.directionalArrow} />}
          secondary={
            directionalArrow ? (
              <FormattedMessage {...m.active} />
            ) : (
              <FormattedMessage {...m.inactive} />
            )
          }
        />
      </ListItem>
    </List>
  );
};
