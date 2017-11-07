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

  _ping() {
    fetch("http://localhost:9080/ping")
      .then(res => res.text())
      .then(response => {
        this.setState(() => ({ response }));
      });
  }

  _create() {
    fetch("http://localhost:9080/create");
  }

  _query() {
    fetch("http://localhost:9080/query")
    .then(res => res.text())
    .then(response => {
      this.setState(() => ({ response }));
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <TouchableHighlight style={styles.btn} onPress={() => this._ping()}>
          <Text style={styles.btnText}>Ping</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.btn} onPress={() => this._create()}>
          <Text style={styles.btnText}>Create</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.btn} onPress={() => this._query()}>
          <Text style={styles.btnText}>Query</Text>
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

  btn: {
    backgroundColor: "#4444FF",
    padding: 10,
    marginBottom: 10
  },

  btnText: {
    color: "white"
  },

  info: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
