import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
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
    defaultMessage: "Use Background Map Feature",
  },
  goTo: {
    id: "screens.Settings.Experiments.BGMaps.goTo",
    defaultMessage: "Go to",
  },
  BGMapsDescription: {
    id: "screens.Settings.Experiments.BGMaps.BGMapsDescription",
    defaultMessage:
      "Use the background maps features to change the map background seen in the mapview. This feature will allow you to upload a raster MBtiles file. Once the file is uploaded, you will be able to set the background map in the mapview and use it even if you are not connected to the internet.",
  },
});

export const BGMapsSettings: NativeNavigationComponent<"BGMapsSettings"> = ({
  navigation,
}) => {
  const [experiments, setExperiments] = useExperiments();

  const { formatMessage: t } = useIntl();

  const { navigate, goBack } = navigation;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.header]}>
        <FormattedMessage {...m.BGMaps} />
      </Text>
      <Text style={[{ marginBottom: 20 }, styles.text]}>
        {t(m.BGMapsDescription)}
      </Text>

      <View style={[styles.switchContainer]}>
        <Text style={[styles.text]}>
          <FormattedMessage {...m.useBGMap} />
        </Text>

        <TouchableOpacity
          onPress={() => {
            setExperiments("backgroundMaps", !experiments.backgroundMaps);
          }}
        >
          <MaterialIcon
            name={
              experiments.backgroundMaps
                ? "check-box"
                : "check-box-outline-blank"
            }
            size={24}
            color="rgba(0, 0, 0, 0.54)"
          />
        </TouchableOpacity>
      </View>

      {experiments.backgroundMaps && (
        <View style={[styles.linkContainer]}>
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

BGMapsSettings.navTitle = m.BGMaps;

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
