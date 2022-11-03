import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
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
    defaultMessage: "Obscure Passcode",
  },
  whatIsObscure: {
    id: "screens.ObscurePasscode.whatIsObscure",
    defaultMessage: "What is Obscure Passcode?",
  },

  toggleMessage: {
    id: "screens.ObscurePasscode.toggleMessage",
    defaultMessage: "Use Obscure Passcode",
  },
  instructions: {
    id: "screens.ObscurePasscode.instructions",
    defaultMessage: "Enter the code above to hide your data in Mapeo",
  },
  description: {
    id: "screens.ObscurePasscode.description",
    defaultMessage:
      "Obscure Passcode is a security feature that allows you to open Mapeo in a decoy mode that hides all of your data. Entering the Obscure Passcode on the intro screen will display an empty version of Mapeo which allows you to create demonstration observations that are not saved to the Mapeo database.",
  },
});

export const ObscurePasscode: NativeNavigationComponent<"ObscurePasscode"> = ({
  navigation,
}) => {
  const { setAuthValues, authValuesSet, authState } = React.useContext(
    SecurityContext
  );

  const { formatMessage: t } = useIntl();

  React.useEffect(() => {
    if (authState === "obscured") {
      navigation.navigate("Settings");
    }
  }, [navigation, authState]);

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title]}>{t(m.whatIsObscure)}</Text>

      <Text style={{ fontSize: 16 }}>{t(m.description)}</Text>

      <TouchableOpacity
        style={styles.switch}
        onPress={() =>
          setAuthValues({
            type: "obscure",
            value: authValuesSet.obscureSet ? null : undefined,
          })
        }
      >
        <React.Fragment>
          <Text style={{ fontSize: 16 }}>{t(m.toggleMessage)}</Text>

          <MaterialIcon
            name={
              authValuesSet.obscureSet ? "check-box" : "check-box-outline-blank"
            }
            size={32}
            color="rgba(0, 0, 0, 0.54)"
          />
        </React.Fragment>
      </TouchableOpacity>

      {authValuesSet.obscureSet && (
        <View style={styles.passbox}>
          <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 20 }}>
            {OBSCURE_PASSCODE}
          </Text>
          <Text style={{ fontSize: 16 }}>{t(m.instructions)}</Text>
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
    textAlign: "center",
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
    alignItems: "center",
  },
});
