// @flow
import * as React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationActions } from "react-navigation";
import debug from "debug";
import LinearGradient from "react-native-linear-gradient";

import type { NavigationScreenConfigProps } from "react-navigation";

import CameraScreen from "./Camera";
import MapScreen from "./MapScreen";
import IconButton from "../sharedComponents/IconButton";
import { ObservationListIcon, SyncIconCircle } from "../sharedComponents/icons";
import GpsPill from "../sharedComponents/GpsPill";
import { withDraft } from "../context/DraftObservationContext";
import type {
  DraftObservationContext as DraftContextType,
  CapturePromise
} from "../context/DraftObservationContext";

const log = debug("Home");

class SceneComponent extends React.PureComponent<*> {
  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, rest);
  }
}

const scenes = {
  map: MapScreen,
  photo: CameraScreen
};

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  newDraft: $ElementType<DraftContextType, "newDraft">
};

type State = {
  index: number,
  routes: any
};

class Home extends React.Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  state = {
    index: 0,
    routes: [
      {
        key: "map",
        title: "Map",
        icon: "map",
        accessibilityLabel: "Map View",
        testID: "mapViewTabButton"
      },
      {
        key: "photo",
        title: "Photo",
        icon: "photo-camera",
        accessibilityLabel: "Camera View",
        testID: "cameraViewTabButton"
      }
    ]
  };

  renderTabBar = (props: any) => (
    // $FlowFixMe
    <TabBar
      {...props}
      style={{ backgroundColor: "white" }}
      activeColor="black"
      inactiveColor="#777777"
      indicatorStyle={{ backgroundColor: "#3333FF" }}
      renderIcon={this.renderIcon}
      renderLabel={() => null}
    />
  );

  renderIcon({ route, color }: any) {
    return <Icon name={route.icon} size={30} color={color} />;
  }

  handleAddPress = (e: any, capture?: CapturePromise) => {
    log("pressed add button");
    const { newDraft, navigation } = this.props;
    newDraft({ tags: {} }, capture);
    navigation.navigate(
      "NewObservation",
      {},
      NavigationActions.navigate({ routeName: "CategoryChooser" })
    );
  };

  // Renders the contents of a tab. SceneComponent just wraps the component in
  // PureComponent, and is probably unnecessary because the Map and CameraView
  // components are optimised anyway.
  renderScene = ({ route, jumpTo }) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      jumpTo={jumpTo}
      onAddPress={this.handleAddPress}
      navigation={this.props.navigation}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <IconButton
            style={styles.leftButton}
            onPress={() => {
              this.props.navigation.navigate("SyncModal");
            }}
          >
            <SyncIconCircle />
          </IconButton>
          <GpsPill />
          <IconButton
            style={styles.rightButton}
            onPress={() => {
              this.props.navigation.navigate("ObservationList");
            }}
          >
            <ObservationListIcon />
          </IconButton>
        </View>
        {/* $FlowFixMe */}
        <TabView
          swipeEnabled={this.state.index !== 0}
          tabBarPosition="bottom"
          navigationState={this.state}
          removeClippedSubviews
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
        <LinearGradient
          style={styles.linearGradient}
          colors={["#0006", "#0000"]}
        />
      </View>
    );
  }
}

export default withDraft(["newDraft"])(Home);

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: 0,
    left: 0,
    height: 60,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rightButton: {},
  leftButton: {
    width: 60,
    height: 60
  },
  linearGradient: {
    height: 60,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: "transparent"
  }
});
