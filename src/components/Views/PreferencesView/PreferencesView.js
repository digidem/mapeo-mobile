// @flow
import React from 'react';
import { Button, Text, View } from 'react-native';

// type State = {};

// export type StateProps = {
//   observations: {
//     [id: string]: Observation,
//   },
// };

// export type DispatchProps = {
//   listObservations: () => void,
// };

type Props = {
  closeLeftDrawer: Function;
}

const PreferencesView = (props: Props) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Text>Prefences &amp; Settings</Text>
    <Button onPress={props.closeLeftDrawer} title="close" />
  </View>
);

export default PreferencesView;
