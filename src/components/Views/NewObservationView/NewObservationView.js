// @flow
import React from 'react';
import { Button, Text, View } from 'react-native';
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

type Props = {
  navigation: NavigationActions;
}

const NewObservationView = (props: Props) => {
  const { dispatch } = props.navigation;

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text>New Observation</Text>
      <Button
        onPress={() => {
          const navigateAction = NavigationActions.navigate({
            routeName: 'TabBarNavigation',
          });
          dispatch(navigateAction);
        }}
        title="Cancel"
      />
    </View>
  );
};

export default NewObservationView;
