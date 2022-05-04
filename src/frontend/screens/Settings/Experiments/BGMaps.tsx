import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { LIGHT_BLUE, LIGHT_GREY, MEDIUM_GREY } from "../../../lib/styles";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";
import { useExperiments } from "../../../hooks/useExperiments";
import { color } from "react-native-reanimated";
import { useNavigation } from "react-navigation-hooks";

const m = defineMessages({
  BGMaps: {
    id: "screens.Settings.Experiments.BGMaps.BGMaps",
    defaultMessage: "Background Maps",
  },
  useBGMap: {
    id: "screens.Settings.Experiments.BGMaps.useBGMap",
    defaultMessage: "Use Background Map Feature",
  },
  goTo: {
    id: "screens.Settings.Experiments.BGMaps.goTo",
    defaultMessage: "Go to",
  },
});

export const BGMapsSettings: NavigationStackScreenComponent = () => {
  const [experiments, setExperiments] = useExperiments();

  const { formatMessage: t } = useIntl();

  const { navigate, goBack } = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.header]}>
        <FormattedMessage {...m.BGMaps} />
      </Text>
      <Text style={[{ marginBottom: 20 }, styles.text]}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Sed ut perspiciatis
      </Text>

      <Text style={[styles.text]}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      <View style={[styles.switchContainer]}>
        <Text style={[styles.text]}>
          <FormattedMessage {...m.useBGMap} />
        </Text>

        <View
          onTouchStart={() => {
            setExperiments("BGMaps", !experiments.BGMaps);
          }}
        >
          <MaterialIcon
            name={experiments.BGMaps ? "check-box" : "check-box-outline-blank"}
            size={24}
            color="rgba(0, 0, 0, 0.54)"
          />
        </View>
      </View>

      {experiments.BGMaps && (
        <View style={[styles.linkContatiner]}>
          <Text style={[styles.text]}>{t(m.goTo)}:</Text>
          <TouchableOpacity
            onPress={() => {
              goBack();
              navigate("MapSettings");
            }}
          >
            <Text
              style={[
                styles.text,
                { color: LIGHT_BLUE, textDecorationLine: "underline" },
              ]}
            >
              {t(m.BGMaps)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

BGMapsSettings.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.BGMaps} />
    </HeaderTitle>
  ),
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    marginTop: 40,
    marginBottom: 20,
  },
  switchContainer: {
    marginTop: 20,
    paddingVertical: 20,
    borderColor: LIGHT_GREY,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
  },
  linkContatiner: {
    backgroundColor: LIGHT_GREY,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    paddingVertical: 40,
    borderRadius: 16,
  },
});
