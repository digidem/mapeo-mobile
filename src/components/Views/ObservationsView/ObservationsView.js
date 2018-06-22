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
  }
};

export type DispatchProps = {
  selectObservation: (o: Observation) => void,
  goToObservationDetail: () => void,
  goToSyncView: () => void,
  goToSettings: () => void,
  listCategories: () => void,
  listObservations: () => void
};

type Props = {
  closeRightDrawer: Function,
  navigation: NavigationActions,
  isFocused: boolean
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
      if (nextProps.isFocused && !this.props.isFocused) {
        nextProps.listObservations();
      }
      return true;
    }
    return false;
  }

  render() {
    const { observations, goToSettings, categories } = this.props;
    const sectionMappings = {};
    let label;

    const keyExtractor = item => item.id.toString();
    const handleItemPress = item => {
      this.props.selectObservation(item);
      this.props.goToObservationDetail();
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
                goToSyncView={this.props.goToSyncView}
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
