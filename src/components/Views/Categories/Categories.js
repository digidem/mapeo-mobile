// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
  Dimensions
} from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Category } from '../../../types/category';
import { DARK_GREY, LIGHT_GREY, CHARCOAL, WHITE } from '../../../lib/styles';

type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  categories: Category[]
};

export type DispatchProps = {
  listCategories: () => void
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CHARCOAL
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: DARK_GREY,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  close: {
    position: 'absolute',
    left: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: LIGHT_GREY
  },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'red',
    shadowRadius: 10,
    shadowOpacity: 1,
    marginBottom: 5
  },
  innerCircle: {
    width: 40,
    height: 40,
    backgroundColor: LIGHT_GREY,
    borderRadius: 50,
    alignItems: 'center'
  },
  cellContainer: {
    flex: 1,
    height: 130,
    paddingTop: 20,
    paddingBottom: 20,
    width: Dimensions.get('window').width / 3
  },
  cell: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  categoryName: {
    color: WHITE,
    textAlign: 'center',
    maxWidth: Dimensions.get('window').width / 3
  }
});

class Categories extends React.PureComponent<
  StateProps & Props & DispatchProps
> {
  componentDidMount() {
    const { listCategories } = this.props;

    listCategories();
  }

  renderHeader = () => {
    const { navigation } = this.props;

    return (
      <TouchableHighlight
        style={{ flexDirection: 'row' }}
        onPress={() => navigation.navigate('Position')}
      >
        <View style={styles.header}>
          <Icon style={styles.close} color="gray" name="close" size={25} />
          <Text style={styles.title}>Categoría</Text>
        </View>
      </TouchableHighlight>
    );
  };

  handleUpdateObservation = (item) => {
    const {
      updateObservation,
      selectedObservation
    } = this.props;

    updateObservation({
      ...selectedObservation,
      icon: item.icon
    });
    this.props.navigation.navigate('ObservationEditor', {
      category: item.id
    });
  };

  renderItem = ({ item }) => (
    <TouchableHighlight
      style={styles.cellContainer}
      onPress={() => this.handleUpdateObservation(item)}
    >
      <View style={styles.cell}>
        <View style={styles.circle}>
          <View style={styles.innerCircle}>{item.icon}</View>
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableHighlight>
  );

  render() {
    const { categories } = this.props;
    const keyExtractor = item => item.id;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <FlatList
          style={{
            flex: 1
          }}
          keyExtractor={keyExtractor}
          renderItem={this.renderItem}
          data={categories}
          numColumns={3}
        />
      </View>
    );
  }
}

export default withNavigation(Categories);
