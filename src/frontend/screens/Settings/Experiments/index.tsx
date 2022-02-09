import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { useNavigation } from "react-navigation-hooks";
import SettingsContext from "../../../context/SettingsContext";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../../sharedComponents/List";

const m = defineMessages({
  p2pUpgrades: {
    id: "screens.Settings.Experiments.p2pUpgrades",
    defaultMessage: "P2P upgrades",
    description: "Label for p2p upgrades",
  },
  p2pUpgradesDesc: {
    id: "screens.Settings.Experiments.p2pUpgradesDesc",
    defaultMessage: "Share and receive updates with nearby devices",
    description: "Label for p2p upgrades description",
  },
  active: {
    id: "screens.Settings.Experiments.active",
    defaultMessage: "Active",
    description: "Inidicates whether directional arrow is active on map",
  },
  inactive: {
    id: "screens.Settings.Experiments.inactive",
    defaultMessage: "Inactive",
    description: "Inidicates whether directional arrow is NOT active on map",
  },
  directionalArrow: {
    id: "screens.Settings.Experiments.directionalArrow",
    defaultMessage: "Directional Arrow",
  },
});

const Experiments = () => {
  const [{ experiments, directionalArrow }, setSettings] = React.useContext(
    SettingsContext
  );
  const { navigate } = useNavigation();

  return (
    <List testID="experimentsList">
      <ListItem
        onPress={() => navigate("P2pUpgrade")}
        testID="p2pUpgradeExperimentButton"
      >
        <ListItemIcon iconName="upgrade" />
        <ListItemText
          primary={<FormattedMessage {...m.p2pUpgrades} />}
          secondary={
            experiments.p2pUpgrade ? (
              <FormattedMessage {...m.active} />
            ) : (
              <FormattedMessage {...m.inactive} />
            )
          }
        />
      </ListItem>
      <ListItem onPress={() => navigate("DirectionalArrow")}>
        <ListItemIcon iconName="map" />
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

export default Experiments;
