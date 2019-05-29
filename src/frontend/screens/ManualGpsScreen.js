// @flow
import React from "react";
import {toLatLon} from 'utm';
import { View, Text, TextInput, TouchableHighlight,  StyleSheet } from "react-native";
import type { NavigationScreenConfigProps } from "react-navigation";
import debug from 'debug';

import { withDraft } from "../context/DraftObservationContext";
import type { DraftObservationContext } from "../context/DraftObservationContext";

import IconButton from "../sharedComponents/IconButton";
import { SaveIcon } from "../sharedComponents/icons";

const log = debug('mapeo:manualGPS');

type Props = {
  ...$Exact<NavigationScreenConfigProps>,
  draft: DraftObservationContext
};

type State = {
  zoneNum: string,
  zoneLetter: string,
  easting: string,
  northing: string
}

class ManualGpsScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: any) => ({
    title: "Manual GPS",
    headerRight: (
      <IconButton onPress={navigation.getParam('handleSavePress')}>
        <SaveIcon inprogress={false} />
      </IconButton>
    )
  });

  state = {
    zoneNum: '',
    zoneLetter: '',
    easting: '',
    northing: '',
  }

  componentDidMount() {
    this.props.navigation.setParams({handleSavePress: this.onSave});
  }

  onSave = () => {
    const {zoneNum, zoneLetter, easting, northing} = this.state;
    const {latitude, longitude} = toLatLon(easting, northing, zoneNum, zoneLetter);
    const {draft, navigation} = this.props;
    draft.setValue({
      lat: latitude,
      lon: longitude,
      tags: {...draft.value.tags}
    });
    // $FlowFixMe
    navigation.pop();
  }

  render() {
    return (
      <View>
        <Text>Zone Number</Text>
        <TextInput
          placeholder="DDD"
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onChangeText={
            zoneNum => this.setState({zoneNum})
          }
          value={this.state.zoneNum}
        />
        <Text>Zone Letter</Text>
        <TextInput
          placeholder="DDD"
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          onChangeText={
            zoneLetter => this.setState({zoneLetter})
          }
          value={this.state.zoneLetter}
        />
        <Text>Easting</Text>
        <TextInput
          placeholder="DDD"
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onChangeText={
            easting => this.setState({easting})
          }
          value={this.state.easting}
        />
        <Text>Northing</Text>
        <TextInput
          placeholder="DDD"
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onChangeText={
            northing => this.setState({northing})
          }
          value={this.state.northing}
        />
      </View>
    );
  }
};

export default withDraft()(ManualGpsScreen)
