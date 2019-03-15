import * as React from "react";
import { View, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";

import CameraView from "./CameraView";
import MapScreen from "./MapScreen";
import ObservationListButton from "./ObservationListButton";
import AddButton from "./AddButton";

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
    return <Icon name={route.icon} size={30} color={color} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            right: 0
          }}
        >
          <ObservationListButton
            onPress={() => this.props.navigation.navigate("ObservationList")}
          />
        </View>
        <TabView
          swipeEnabled={this.state.index !== 0}
          tabBarPosition="bottom"
          navigationState={this.state}
          renderScene={SceneMap({
            map: MapScreen,
            photo: CameraView
          })}
          renderTabBar={this.renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: 75,
            alignSelf: "center"
          }}
        >
          <AddButton />
        </View>
      </View>
    );
  }
}
