/*!
* Mapeo Mobile is an Android app for offline participatory mapping.
*
* Copyright (C) 2017 Digital Democracy
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, AppRegistry } from "react-native";
import RNNode from "react-native-node";

export default class BenchmarkApp extends Component {
  constructor(props) {
    super(props);
    this.state = { response: "" };
  }

  componentDidMount() {
    RNNode.start();
    setInterval(() => {
      fetch("http://localhost:9080/test")
        .then(res => res.text())
        .then(response => {
          this.setState(() => ({ response }));
        });
    }, 500);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>{this.state.response}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white"
  },

  info: {
    textAlign: "left",
    color: "#333333",
    marginBottom: 5
  }
});

AppRegistry.registerComponent("MapeoMobile", () => BenchmarkApp);
