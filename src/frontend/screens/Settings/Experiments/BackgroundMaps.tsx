import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Linking, StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { LIGHT_BLUE, LIGHT_GREY } from "../../../lib/styles";

import { useExperiments } from "../../../hooks/useExperiments";
import { NativeNavigationComponent } from "../../../sharedTypes";

const m = defineMessages({
  BGMaps: {
    id: "screens.Settings.Experiments.BGMaps.BGMaps",
    defaultMessage: "Background Maps",
  },
  useBGMap: {
    id: "screens.Settings.Experiments.BGMaps.useBGMap",
    defaultMessage: "Use Background Maps (Feature)",
  },
  goTo: {
    id: "screens.Settings.Experiments.BGMaps.goTo",
    defaultMessage: "Try it now",
  },
  BGMapsDescription: {
    id: "screens.Settings.Experiments.BGMaps.BGMapsDescription",
    defaultMessage:
      "The Background Map in Mapeo is displayed on the home map screen and is used as a background for the observations you collect. This new pilot feature allows you to add your own custom maps and switch between multiple maps. Background Maps is currently an advanced feature - an existing map file in .mbtiles format is required for testing.",
  },
  BGMapsOnlineSupport: {
    id: "screens.Settings.Experiments.BGMaps.BGMapsOnlineSupport",
    defaultMessage: "For online support on generating map files, see: ",
  },
  feedBack: {
    id: "screens.Settings.Experiments.BGMaps.feedBack",
    defaultMessage:
      "We welcome any feedback on this feature before the final version is released.",
  },
  warning: {
    id: "screens.Settings.Experiments.BGMaps.warning",
    defaultMessage:
      "WARNING: When this feature is enabled, you will not have access to the map you had previously been using in Mapeo. Turn off Map Manager to switch back to your previous map. Please note that this feature is still in the pilot testing phase and you will need to re-import any maps added to the Map Manager once the final version is released.",
  },
  shortLink: {
    id: "screens.Settings.Experiments.BGMaps.shortLink",
    description:
      "Used as a link to the gitbooks documentation for adding background maps",
    defaultMessage: "here.",
  },
});

export const BackgroundMapsSettings: NativeNavigationComponent<"BGMapsSettings"> = ({
  navigation,
}) => {
  const [experiments, setExperiments] = useExperiments();

  const { formatMessage: t } = useIntl();

  const { navigate, goBack } = navigation;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>{t(m.BGMapsDescription)}</Text>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            "https://docs.mapeo.app/complete-reference-guide/customization-options/custom-base-maps/creating-custom-maps/creating-mbtiles"
          );
        }}
      >
        <>
          <Text style={[styles.text, { marginBottom: 0 }]}>
            {t(m.BGMapsOnlineSupport)}
          </Text>
          <Text
            style={[
              styles.text,
              { color: LIGHT_BLUE, textDecorationLine: "underline" },
            ]}
          >
            {t(m.shortLink)}
          </Text>
        </>
      </TouchableOpacity>
      <Text style={styles.text}>{t(m.feedBack)}</Text>
      <Text style={styles.text}>{t(m.warning)}</Text>
      <TouchableOpacity
        onPress={() => {
          setExperiments("backgroundMaps", !experiments.backgroundMaps);
        }}
        style={[styles.switchContainer, { alignItems: "center" }]}
      >
        <Text style={[styles.text, { alignSelf: "flex-end" }]}>
          <FormattedMessage {...m.useBGMap} />
        </Text>

        <MaterialIcon
          name={
            experiments.backgroundMaps ? "check-box" : "check-box-outline-blank"
          }
          size={24}
          color="rgba(0, 0, 0, 0.54)"
        />
      </TouchableOpacity>

      {experiments.backgroundMaps && (
        <View style={[styles.linkContainer]}>
          <Text style={[styles.text, { marginBottom: 0 }]}>{t(m.goTo)}:</Text>
          <TouchableOpacity
            onPress={() => {
              goBack();
              navigate("MapSettings");
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  color: LIGHT_BLUE,
                  textDecorationLine: "underline",
                  marginBottom: 0,
                },
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

BackgroundMapsSettings.navTitle = m.BGMaps;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    marginBottom: 20,
  },
  linkContainer: {
    backgroundColor: LIGHT_GREY,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    paddingVertical: 40,
    borderRadius: 16,
  },
});
