// @flow
import * as React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationActions } from "react-navigation";
import debug from "debug";

import type { NavigationScreenConfigProps } from "react-navigation";

import CameraScreen from "./CameraScreen";
import MapScreen from "./MapScreen";
import ObservationListButton from "../components/ObservationListButton";
import { withDraft } from "../context/DraftObservationContext";
import type {
  DraftObservationContext as DraftContextType,
  CapturePromise
} from "../context/DraftObservationContext";

const log = debug("HomeScreen");

const styles = StyleSheet.create({
  listButtonContainer: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: 0
  }
});

class SceneComponent extends React.PureComponent<*> {
  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, rest);
  }
}

function SceneMap<T: *>(
  scenes: { [key: string]: React.ComponentType<T> },
  onAddPress: $ElementType<DraftContextType, "addPhoto">
) {
  // eslint-disable-next-line react/display-name
  return ({ route, jumpTo }: T) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      jumpTo={jumpTo}
      onAddPress={onAddPress}
    />
  );
}

type Props = {
  ...NavigationScreenConfigProps,
  draft: DraftContextType
};

type State = {
  index: number,
  routes: any
};

class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  state = {
    index: 0,
    routes: [
      { key: "map", title: "Map", icon: "map" },
      { key: "photo", title: "Photo", icon: "photo-camera" }
    ]
  };

  renderTabBar = (props: any) => (
    // $FlowFixMe
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

  renderIcon({ route, color }: any) {
    return <Icon name={route.icon} size={30} color={color} />;
  }

  handleAddPress = (e: any, capture?: CapturePromise) => {
    log("pressed add button");
    const { draft, navigation } = this.props;
    draft.new({ tags: {} }, capture);
    // $FlowFixMe - need to fix type that navigation prop is not optional
    navigation.navigate(
      "NewObservation",
      {},
      NavigationActions.navigate({ routeName: "ObservationCategories" })
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.listButtonContainer}>
          <ObservationListButton
            onPress={() => {
              // $FlowFixMe - need to fix type that navigation prop is not optional
              this.props.navigation.navigate("ObservationList");
            }}
          />
        </View>
        {/* $FlowFixMe */}
        <TabView
          swipeEnabled={this.state.index !== 0}
          tabBarPosition="bottom"
          navigationState={this.state}
          renderScene={SceneMap(
            {
              map: MapScreen,
              photo: CameraScreen
            },
            this.handleAddPress
          )}
          renderTabBar={this.renderTabBar}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
      </View>
    );
  }
}

export default withDraft(HomeScreen);
