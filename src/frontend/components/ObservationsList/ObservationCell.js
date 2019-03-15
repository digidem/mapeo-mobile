// @flow
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import moment from "moment";

// import I18n from "react-native-i18n";
// import Image from "react-native-remote-svg";
// import esLocale from "moment/locale/es";

// import { LIGHT_GREY } from "../../../lib/styles";
// import moment from "../../../lib/localizedMoment";
// import Thumbnail from "../../Base/Thumbnail";
// import { getSvgUri } from "../../../lib/media";

type Props = {
  onPress: (id: string) => void,
  observation: {}
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    width: Dimensions.get("window").width,
    paddingHorizontal: 20
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 20,
    fontWeight: "700",
    color: "black"
  },
  text: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    borderColor: "#EAEAEA",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -5,
    shadowColor: "black",
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  circleWithMedia: {
    position: "absolute",
    right: 0,
    bottom: -5,
    width: 25,
    height: 25,
    zIndex: 5
  },
  icon: { width: 15, height: 15 },
  iconWithMedia: { width: 12, height: 12 },
  innerCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#EAEAEA",
    borderRadius: 50
  },
  title: { fontSize: 18, fontWeight: "700", color: "black" },
  titleLong: { fontSize: 16, fontWeight: "700", color: "black" },
  media: { width: 60, height: 60, borderRadius: 7 }
});

class ObservationCell extends React.PureComponent<Props> {
  handlePress = () => {
    const { onPress, observation } = this.props;
    onPress(observation.id);
  };

  render() {
    const { observation } = this.props;

    let dateString;
    if (false) {
      dateString = moment(observation.created_at).calendar(null, {
        sameDay: "[Hoy], h:mm A",
        nextDay: "[Mañana], h:mm A",
        nextWeek: "ddd, h:mm A",
        lastDay: "[Ayer], h:mm A",
        lastWeek: "ddd, h:mm A",
        sameElse: "MM/D/YYYY, h:mm A"
      });
    } else {
      dateString = moment(observation.created_at).calendar(null, {
        sameDay: "[Today], h:mm A",
        nextDay: "[Tomorrow], h:mm A",
        nextWeek: "ddd, h:mm A",
        lastDay: "[Yesterday], h:mm A",
        lastWeek: "ddd, h:mm A",
        sameElse: "MM/D/YYYY, h:mm A"
      });
    }

    // const hasMedia = observation && !!observation.attachments.length;
    // const source = hasMedia ? observation.attachments[0] : "";

    return (
      <TouchableOpacity onPress={this.handlePress}>
        <View style={styles.container}>
          <View style={styles.text}>
            <Text style={styles.title}>{dateString}</Text>
            <Text>{observation.categoryId}</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <View style={styles.circle} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ObservationCell;
