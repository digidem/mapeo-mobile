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
        <View style={styles.mapPlaceholder} />
        <View style={styles.buttons}>
          <TouchableHighlight style={styles.btn} onPress={() => this._ping()}>
            <Text style={styles.btnText}>Ping</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.btn} onPress={() => this._create()}>
            <Text style={styles.btnText}>Create</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.btn} onPress={() => this._query()}>
            <Text style={styles.btnText}>Query</Text>
          </TouchableHighlight>
        </View>
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

  mapPlaceholder: {
    backgroundColor: "#AAFFAA",
    alignSelf: "stretch",
    height: 300
  },

  buttons: {
    flexDirection: "row"
  },

  btn: {
    backgroundColor: "#4444FF",
    padding: 10,
    margin: 10
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
