import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { SecurityContext } from "../../context/SecurityContext";
import SettingsContext from "../../context/SettingsContext";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon } from "../../sharedComponents/icons";
import { EnterPasscode } from "./EnterPasscode";
import { NewPasscode } from "./NewPasscode";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode",
    defaultMessage: "App Passcode",
  },
});

export const AppPasscode: NavigationStackScreenComponent = () => {
  const [authstate, setAuthState] = React.useContext(SecurityContext);
  const [{ experiments }] = React.useContext(SettingsContext);
  const { navigate } = useNavigation();

  React.useEffect(() => {
    if (!experiments.appPasscode) navigate("Settings");
  }, [experiments]);

  return (
    <View style={styles.pageContainer}>
      {!authstate.passcode ? <NewPasscode /> : <EnterPasscode />}
    </View>
  );
};

AppPasscode.navigationOptions = () => ({
  headerTitle: () => (
    <HeaderTitle style={{}}>
      <FormattedMessage {...m.title} />
    </HeaderTitle>
  ),
  headerLeft: ({ onPress }) =>
    onPress && (
      <IconButton onPress={onPress}>
        <BackIcon />
      </IconButton>
    ),
});
const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});
