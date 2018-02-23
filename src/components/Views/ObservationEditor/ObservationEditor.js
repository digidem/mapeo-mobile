// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import { View, Text } from 'react-native';
import type { Category } from '@types/category';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  category?: Category
};

class ObservationEditor extends React.PureComponent<Props & StateProps> {
  render() {
    const { category, navigation } = this.props;

    if (!category) {
      navigation.goBack();
      return <View />;
    }

    return (
      <View>
        <Text>{category.name}</Text>
      </View>
    );
  }
}

export default withNavigation(ObservationEditor);
