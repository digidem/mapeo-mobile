// @flow
import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  FlatList,
  Dimensions
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import SyncIcon from 'react-native-vector-icons/FontAwesome';
import SettingsIcon from 'react-native-vector-icons/MaterialIcons';
import { orderBy, map } from 'lodash';
import I18n from 'react-native-i18n';
import type { Observation } from '../../../types/observation';
import type { Category } from '../../../types/category';
import ObservationCell from './ObservationCell';
import ObservationHeader from './ObservationHeader';
import moment from '../../../lib/localizedMoment';

export type StateProps = {
  drawerOpened: boolean,
  observations: Observation[],
  categories: {
    [id: string]: Category
  },
  icons: Object,
  resizedImages: Object
};

export type DispatchProps = {
  selectObservation: (o: Observation) => void,
  listCategories: () => void,
  listObservations: () => void,
  getResizedImage: (source: string) => void
};

type Props = {
  closeRightDrawer: Function,
  navigation: NavigationActions
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ObservationsView extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  componentDidMount() {
    this.props.listObservations();
    if (!Object.keys(this.props.categories).length) {
      this.props.listCategories();
    }
  }

  shouldComponentUpdate(
    nextProps: Props & StateProps & DispatchProps,
    nextState: State
  ) {
    if (nextProps !== this.props || nextState !== this.state) {
      if (
        nextProps.navigation.isFocused() &&
        !this.props.navigation.isFocused()
      ) {
        nextProps.listObservations();
      }
      return true;
    }
    return false;
  }

  render() {
    const {
      navigation,
      observations,
      categories,
      selectObservation,
      icons,
      resizedImages,
      getResizedImage
    } = this.props;
    const sectionMappings = {};
    let label;

    const keyExtractor = item => item.id.toString();
    const handleItemPress = item => {
      selectObservation(item);
      navigation.navigate({ routeName: 'ObservationDetailView' });
    };
    const goToSettings = () => {
      navigation.navigate({ routeName: 'SettingsView' });
    };
    const goToSyncView = () => {
      navigation.navigate({ routeName: 'SyncView' });
    };

    return (
      <TouchableWithoutFeedback>
        <View
          style={{
            flex: 1
          }}
        >
          <FlatList
            scrollEnabled
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <ObservationHeader
                closeRightDrawer={this.props.closeRightDrawer}
                goToSyncView={goToSyncView}
                onSettingsPress={goToSettings}
              />
            }
            style={{ width: Dimensions.get('window').width }}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <ObservationCell
                currentLocale={I18n.currentLocale()}
                navigation={this.props.navigation}
                observation={item}
                onPress={handleItemPress}
                category={categories[item.categoryId]}
                icons={icons}
                resizedImages={resizedImages}
                getResizedImage={getResizedImage}
              />
            )}
            data={observations}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default ObservationsView;
