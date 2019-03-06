// import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";

import CameraView from "./CameraView";
import MapView from "./MapView";

export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: "map", title: "Map", icon: "map" },
      { key: "photo", title: "Photo", icon: "photo-camera" }
    ]
  };

  renderTabBar = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: "white" }}
      activeColor="black"
      inactiveColor="#777777"
      indicatorStyle={{ backgroundColor: "blue" }}
      renderIcon={this.renderIcon}
      renderLabel={() => null}
    />
  );

  renderIcon({ route, color }) {
    console.log("render icon", route.icon);
    return <Icon name={route.icon} size={30} color={color} />;
  }

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
          renderTabBar={this.renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
        {/* <View style={{ position: "absolute", bottom: 20 }}>
          <Text>Hello World</Text>
        </View> */}
      </View>
    );
  }
}
