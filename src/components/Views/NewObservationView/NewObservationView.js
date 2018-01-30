// @flow
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';

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

class NewObservationView extends React.Component {
  render() {
    const { dispatch } = this.props.navigation;

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>New Observation</Text>
        <Button onPress={() => {
          const navigateAction = NavigationActions.navigate({
            routeName: "MapView",
          });
          dispatch(navigateAction);
        }}
        title="Cancel" />
      </View>
    );
  }
}

export default NewObservationView;

