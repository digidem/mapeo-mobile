import * as React from "react";
import CameraView from "./CameraView";
import { View, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import MapView from "./MapView";

export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [{ key: "map", title: "Map" }, { key: "photo", title: "Photo" }]
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabView
          swipeEnabled={this.state.index !== 0}
          tabBarPosition="bottom"
          navigationState={this.state}
          renderScene={SceneMap({
            map: MapView,
            photo: CameraView
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
      </View>
    );
  }
}
