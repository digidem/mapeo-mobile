import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, View } from "react-native";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { OBSCURE_PASSCODE } from "../constants";
import { LIGHT_GREY } from "../lib/styles";
import Text from "../sharedComponents/Text";
import { NativeNavigationComponent } from "../sharedTypes";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SecurityContext } from "../context/SecurityContext";

const m = defineMessages({
  title: {
    id: "screens.ObscurePasscode.title",
    defaultMessage: "Kill Passcode",
  },
  toggleMessage: {
    id: "screens.ObscurePasscode.toggleMessage",
    defaultMessage: "Use Kill Passcode",
  },
  instructions: {
    id: "screens.ObscurePasscode.instructions",
    defaultMessage: "Enter the code above to hide sensitive data in Mapeo",
  },
});

export const ObscurePasscode: NativeNavigationComponent<"ObscurePasscode"> = ({
  navigation,
}) => {
  const { setAuthValues, authValuesSet, obscureModeOn } = React.useContext(
    SecurityContext
  );

  React.useEffect(() => {
    if (obscureModeOn) {
      navigation.navigate("Settings");
    }
  }, [navigation, obscureModeOn]);

  return (
    <ScrollView style={styles.container}>
      {/* TO DO: Get translation and copy from programs */}
      <Text style={{ fontSize: 16 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur
        {/* <FormattedMessage {...m.body} /> */}
      </Text>

      <View style={styles.switch}>
        <Text style={{ fontSize: 16 }}>
          <FormattedMessage {...m.toggleMessage} />
        </Text>
        <TouchableOpacity
          shouldActivateOnStart
          onPress={() =>
            setAuthValues({
              type: "obscure",
              value: authValuesSet.obscureSet ? null : undefined,
            })
          }
        >
          <MaterialIcon
            name={
              authValuesSet.obscureSet ? "check-box" : "check-box-outline-blank"
            }
            size={32}
            color="rgba(0, 0, 0, 0.54)"
          />
        </TouchableOpacity>
      </View>

      {authValuesSet.obscureSet && (
        <View style={styles.passbox}>
          <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 20 }}>
            {OBSCURE_PASSCODE}
          </Text>
          <Text style={{ fontSize: 16 }}>
            <FormattedMessage {...m.instructions} />
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

ObscurePasscode.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  passbox: {
    borderRadius: 10,
    backgroundColor: LIGHT_GREY,
    marginTop: 30,
    padding: 20,
    fontSize: 20,
    marginBottom: 40,
  },
  switch: {
    alignSelf: "flex-start",
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 2,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 2,
    paddingVertical: 20,
    marginTop: 30,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
