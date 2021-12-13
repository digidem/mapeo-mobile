import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, View } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon } from "../../sharedComponents/icons";
import { SecurityContext } from "../Security/SecurityContext";
import { EnterPasscode } from "./EnterPasscode";
import { NewPasscode } from "./NewPasscode";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode",
    defaultMessage: "App Passcode",
  },
});

export const AppPasscode: NavigationStackScreenComponent = () => {
  const { passIsSet } = React.useContext(SecurityContext);

  return (
    <View style={styles.pageContainer}>
      {!passIsSet ? <NewPasscode /> : <EnterPasscode />}
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
