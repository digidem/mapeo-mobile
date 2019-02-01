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
import { values } from 'lodash';
import type { NavigationScreenProp } from 'react-navigation';
import SyncIcon from 'react-native-vector-icons/FontAwesome';
import SettingsIcon from 'react-native-vector-icons/MaterialIcons';
import { orderBy, map } from 'lodash';
import I18n from 'react-native-i18n';
import type { Observation as ObservationType } from '../../../types/observation';
import type { Category } from '../../../types/category';
import ObservationCell from './ObservationCell';
import ObservationHeader from './ObservationHeader';
import Observation from '../../../api/observations';
import moment from '../../../lib/localizedMoment';
import memoize from 'memoize-one'

export type StateProps = {
  drawerOpened: boolean,
  categories: {
    [id: string]: Category
  },
  icons: Object
};

export type DispatchProps = {
  selectObservation: (o: ObservationType) => void
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

  constructor (props) {
    super(props)
    this.state = {
      observations: []
    }
  }

  componentDidMount () {
    this.subscription = this.props.navigation.addListener('willFocus', this.willFocus)
  };

  componentWillUnmount () {
    this.subscription.remove();
  }

  willFocus = () => {
    var observable = Observation.list()
    console.log('asking for obs')
    var onSuccess = (result) => {
      console.log('got obs')
      this.setState({
        observations: values(result).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      })
    };
    var onError = (err) => {
      console.log('eff', err);
    };
    observable.subscribe(onSuccess, onError);
  }

  render() {
    const {
      navigation,
      categories,
      selectObservation,
      icons
    } = this.props;

    const {
      observations
    } = this.state;

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
    const goToMapView = () => {
      navigation.navigate({ routeName: 'MapView', });
    };
    console.log('rendering', observations.length)

    return (
      <TouchableWithoutFeedback>
        <View
          style={{
            flex: 1
          }}
        >
          <FlatList
            initialNumToRender={20}
            scrollEnabled
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <ObservationHeader
                goToMapView={goToMapView}
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
