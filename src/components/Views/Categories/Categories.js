// @flow
import React from 'react';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Category } from '../../../types/category';
import type { Observation } from '../../../types/observation';
import { DARK_GREY, LIGHT_GREY, WHITE, CHARCOAL } from '../../../lib/styles';

type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  categories: Category[],
  selectedObservation: Observation
};

export type DispatchProps = {
  listCategories: () => void,
  updateObservation: (obs: Observation) => void,
  resetNavigation: () => void
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
  cell: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  categoryName: {
    color: 'black',
    fontWeight: '700',
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

  map: any;
  handleUpdateObservation = item => {
    const { updateObservation, selectedObservation } = this.props;

    updateObservation({
      ...selectedObservation,
      icon: item.icon
    });
    this.props.navigation.navigate('ObservationEditor', {
      category: item.id
    });
  };

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

  renderItem = ({ item }) => {
    const { resetNavigation } = this.props;

    return (
      <TouchableHighlight
        style={styles.cellContainer}
        underlayColor="transparent"
        onPress={() => {
          resetNavigation();
          this.handleUpdateObservation(item);
        }}
      >
        <View style={styles.cell}>
          <View style={styles.circle}>
            <View style={styles.innerCircle}>{item.icon}</View>
          </View>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { categories, selectedObservation } = this.props;
    const keyExtractor = item => item.id;

    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          centerCoordinate={
            selectedObservation
              ? [selectedObservation.lon, selectedObservation.lat]
              : undefined
          }
          ref={c => (this.map = c)}
          zoomLevel={12}
          logoEnabled={false}
        >
          {selectedObservation && (
            <MapboxGL.PointAnnotation
              id="selected"
              coordinate={[selectedObservation.lon, selectedObservation.lat]}
              selected
            >
              <MapboxGL.Callout>
                <View
                  style={{
                    backgroundColor: WHITE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 5
                  }}
                >
                  {!!selectedObservation.media.length && (
                    <Image
                      style={{ width: 50, height: 50, marginBottom: 10 }}
                      source={{ uri: selectedObservation.media[0].source }}
                    />
                  )}
                  <Text style={{ color: CHARCOAL }}>
                    {selectedObservation.lon}, {selectedObservation.lat}
                  </Text>
                </View>
              </MapboxGL.Callout>
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
        <FlatList
          style={{
            height: 80,
            width: Dimensions.get('window').width,
            backgroundColor: WHITE
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
