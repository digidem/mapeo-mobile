import React from "react";
import { Text, TouchableHighlight } from "react-native";

import CenteredView from "../components/CenteredView";

class ObservationCategoriesScreen extends React.Component {
  componentDidMount() {
    console.log("Categories mount");
  }
  componentWillUnmount() {
    console.log("Categories UNmount");
  }
  render() {
    const { navigation } = this.props;
    return (
      <CenteredView>
        <TouchableHighlight
          onPress={() => navigation.navigate("ObservationEdit")}
        >
          <Text style={{ padding: 50, backgroundColor: "#cccccc" }}>
            Navigate
          </Text>
        </TouchableHighlight>
      </CenteredView>
    );
  }
}

ObservationCategoriesScreen.navigationOptions = {
  title: "Category"
};

export default ObservationCategoriesScreen;
