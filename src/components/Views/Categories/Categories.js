// @flow
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import I18n from 'react-native-i18n';
import CloseIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckIcon from 'react-native-vector-icons/Octicons';

import type { Category } from '../../../types/category';
import type { Field } from '../../../types/field';
import type { Observation } from '../../../types/observation';
import Header from '../../Base/Header';
import {
  DARK_GREY,
  LIGHT_GREY,
  VERY_LIGHT_BLUE,
  WHITE
} from '../../../lib/styles';

type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  allFields: Object,
  categories: Category[],
  selectedObservation?: Observation,
  updateFlow: boolean
};

export type DispatchProps = {
  listCategories: () => void,
  updateObservation: (obs: Object) => void,
  clearSelectedObservation: () => void
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: DARK_GREY,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  close: { position: 'absolute', left: 10 },
  title: { fontSize: 20, fontWeight: '700', color: LIGHT_GREY },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 5
  },
  innerCircle: {
    width: 40,
    height: 40,
    backgroundColor: LIGHT_GREY,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellContainer: {
    flex: 1,
    height: 130,
    paddingTop: 20,
    paddingBottom: 20,
    width: Dimensions.get('window').width / 3
  },
  cell: { flex: 1, flexDirection: 'column', alignItems: 'center' },
  categoryName: {
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: Dimensions.get('window').width / 3 - 2
  },
  checkIcon: { alignSelf: 'center', marginLeft: 3 },
  greyCheck: {
    backgroundColor: LIGHT_GREY,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: 'center'
  },
  greyCheckOuterCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d6d2cf'
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class Categories extends React.Component<Props & StateProps & DispatchProps> {
  componentDidMount() {
    const { listCategories } = this.props;

    listCategories();
  }

  shouldComponentUpdate(nextProps: Props & StateProps & DispatchProps) {
    if (nextProps.navigation.isFocused()) {
      return nextProps !== this.props;
    }

    return false;
  }

  map: any;
  handleUpdateObservation = (item: Category) => {
    const {
      allFields,
      updateObservation,
      selectedObservation,
      navigation
    } = this.props;

    if (selectedObservation) {
      updateObservation({
        id: selectedObservation.id,
        categoryId: item.id,
        fields: item.fields.map(field => allFields[field])
      });

      navigation.navigate({
        routeName: 'ObservationEditor',
        params: {
          category: item.id
        }
      });
    }
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cellContainer}
      underlayColor="transparent"
      onPress={() => {
        this.handleUpdateObservation(item);
      }}
    >
      <View style={styles.cell}>
        {!!item.icon && (
          <View style={styles.circle}>
            <Image
              source={item.icon}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </View>
        )}
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  handleBack = () => {
    const { navigation, clearSelectedObservation, updateFlow } = this.props;

    if (!updateFlow) {
      clearSelectedObservation();
    }

    navigation.goBack();
  };

  render() {
    const { categories } = this.props;
    const keyExtractor = item => item.id;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <Header
              leftIcon={
                <TouchableOpacity
                  underlayColor="rgba(0, 0, 0, 0.5)"
                  onPress={this.handleBack}
                >
                  <CloseIcon color="#9E9C9C" name="window-close" size={30} />
                </TouchableOpacity>
              }
              rightIcon={
                <View style={styles.greyCheckOuterCircle}>
                  <View style={styles.greyCheck}>
                    <CheckIcon
                      color="white"
                      name="check"
                      size={18}
                      style={styles.checkIcon}
                    />
                  </View>
                </View>
              }
            />
          }
          style={{
            height: 80,
            width: Dimensions.get('window').width,
            backgroundColor: VERY_LIGHT_BLUE
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

export default Categories;
