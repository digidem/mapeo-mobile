import Config from "react-native-config";

export const config = {
  MAPBOX_ACCESS_TOKEN:
    Config.MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_ACCESS_TOKEN,
};
