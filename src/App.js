import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from "react-native";
import RNNode from "react-native-node";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { response: "" };
  }

  componentDidMount() {
    RNNode.start();
  }

  _onPress() {
    fetch("http://localhost:9080")
      .then(res => res.text())
      .then(response => {
        this.setState(() => ({ response }));
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this._onPress()}
        >
          <Text style={styles.buttonText}>Press me</Text>
        </TouchableHighlight>
        <Text style={styles.info}>{this.state.response}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },

  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },

  button: {
    backgroundColor: "#4444FF",
    padding: 10
  },

  buttonText: {
    color: "white"
  },

  info: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
