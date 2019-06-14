// @flow
import * as React from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import api from "../api";

type Props = {
  children: (styleURL: string) => React.Node,
  styleURL?: string
}

export default class MapStyleProvider extends React.Component<Props,
  { styleURL: string }
> {

  constructor(props: Props) {
    super(props);
    this.state = {
        styleURL: this.props.styleURL || MapboxGL.StyleURL.Outdoors
    }
  }

  async componentDidMount() {
    try {
      const offlineStyleURL = api.getMapStyleUrl("default");
      // Check if the mapStyle exists on the server
      await api.getMapStyle("default");
      this.setState({ styleURL: offlineStyleURL });
    } catch (e) {
      // If we don't have a default offline style, don't do anything
    }
  }

  render() {
    return this.props.children(this.state.styleURL);
  }
}
