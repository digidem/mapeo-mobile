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
import type { NavigationScreenProp } from 'react-navigation';
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
  icons: Object
};

export type DispatchProps = {
  selectObservation: (o: Observation) => void
};

type Props = {
  closeRightDrawer: Function,
  navigation: NavigationScreenProp<*>
};

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ObservationsView extends React.Component<
  Props & StateProps & DispatchProps
> {
  render() {
    const {
      navigation,
      observations,
      categories,
      selectObservation,
      icons
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
