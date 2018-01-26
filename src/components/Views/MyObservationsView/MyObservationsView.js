// @flow
import React from 'react';
import { Button, StyleSheet } from 'react-native';

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
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back"
      />
    );
  }
}

export default MyObservationsView;

