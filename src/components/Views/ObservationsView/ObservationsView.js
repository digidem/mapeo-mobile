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
import ObservationCell from './ObservationCell';
import ObservationHeader from './ObservationHeader';
import moment from '../../../lib/localizedMoment';

export type StateProps = {
  drawerOpened: boolean,
  observations: Observation[]
};

export type DispatchProps = {
  selectObservation: (o: Observation) => void,
  goToObservationDetail: () => void,
  goToSyncView: () => void,
  goToSettings: () => void
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
  Props & StateProps & DispatchProps
> {
  shouldComponentUpdate(nextProps: Props & StateProps) {
    if (nextProps !== this.props) {
      return true;
    }
    return false;
  }

  render() {
    const { observations, goToSettings } = this.props;
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
