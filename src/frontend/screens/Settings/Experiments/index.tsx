import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";

import SettingsContext from "../../../context/SettingsContext";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "../../../sharedComponents/List";

const m = defineMessages({
  p2pUpgrades: {
    id: "screens.Settings.Experiments.p2pUpgrades",
    defaultMessage: "P2P App Updates",
    description: "Label for p2p app updates",
  },
  p2pUpgradesDesc: {
    id: "screens.Settings.Experiments.p2pUpgradesDesc",
    defaultMessage: "Share and receive updates with nearby devices",
    description: "Label for p2p upgrades description",
  },
  active: {
    id: "screens.Settings.Experiments.active",
    defaultMessage: "On",
    description: "Indicates that the experimental feature is enabled",
  },
  inactive: {
    id: "screens.Settings.Experiments.inactive",
    defaultMessage: "Off",
    description: "Indicates that the experimental feature is not enabled",
  },
  directionalArrow: {
    id: "screens.Settings.Experiments.directionalArrow",
    defaultMessage: "Directional Arrow",
  },
  title: {
    id: "screens.Settings.Experiments.title",
    defaultMessage: "Experiments",
  },
});

const Experiments: NavigationStackScreenComponent = () => {
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
        <ListItemIcon iconName="sync" />
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

Experiments.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
};

export default Experiments;
