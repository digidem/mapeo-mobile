// @flow
import React from "react";
import { View, Text, TextInput, TouchableHighlight,  StyleSheet } from "react-native";
import type { NavigationScreenConfigProps } from "react-navigation";

import { withDraft } from "../context/DraftObservationContext";
import type { DraftObservationContext } from "../context/DraftObservationContext";

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  draft: DraftObservationContext
};

type State = {
  longitude: string,
  latitude: string
}

class ManualGpsScreen extends React.Component<Props, State> {
  // handleCancelPress = (e: any) => {
  //   // $FlowFixMe
  //   this.props.navigation.pop();
  // };
  state = {
    longitude: '',
    latitude: ''
  }

  onSave = () => {
    const {longitude, latitude} = this.state;
    const {draft, navigation} = this.props;
    draft.setValue({
      tags: {...draft.value.tags},
      lon: parseFloat(longitude),
      lat: parseFloat(latitude)
    });
    // $FlowFixMe
    navigation.pop();
  }

  render() {
    return (
      <View>
        <Text>Wrapped Manual GPS Entry</Text>
        <Text>Longitude</Text>
        <TextInput
          placeholder="DDD"
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onChangeText={
            longitude => this.setState({longitude})
          }
          value={this.state.longitude.toString()}
        />
        <Text>Latitude</Text>
        <TextInput
          placeholder="DDD"
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onChangeText={
            latitude => this.setState({latitude})
          }
          value={this.state.latitude.toString()}
        />
        <TouchableHighlight onPress={this.onSave}>
          <Text>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
};

export default withDraft()(ManualGpsScreen)
