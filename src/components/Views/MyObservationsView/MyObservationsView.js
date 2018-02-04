// @flow
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

// type State = {};

// export type StateProps = {
//   observations: {
//     [id: string]: Observation,
//   },
// };

// export type DispatchProps = {
//   listObservations: () => void,
// };

const styles = StyleSheet.create({

});

class MyObservationsView extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Observations</Text>
        <Button onPress={this.props.closeRightDrawer} title='close' />
      </View>
    );
  }
}

export default MyObservationsView;

