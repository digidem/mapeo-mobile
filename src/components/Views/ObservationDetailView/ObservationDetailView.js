// @flow
import React from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { NavigationActions, withNavigation } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import LeftChevron from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import type { Observation } from '../../../types/observation';
import { CHARCOAL, DARK_GREY, MANGO } from '../../../lib/styles';
import CategoryPin from '../../../images/category-pin.png';

export type StateProps = {
  selectedObservation?: Observation
};

export type DispatchProps = {
  goToPhotoView: (photoSource: string) => void,
  goToTabNav: () => void,
  addObservation: (o: Observation) => void,
  resetNavigation: () => void
};

export type Props = {
  navigation: NavigationActions
};

const styles = StyleSheet.create({
  backChevron: {
    marginLeft: 15
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    backgroundColor: DARK_GREY,
    position: 'absolute',
    bottom: 0,
    padding: 15
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center'
  },
  cancelButton: {
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: 'gray'
  },
  categoryIconContainer: {
    alignItems: 'center',
    marginTop: -65,
    marginBottom: 30
  },
  categoryPin: {
    alignSelf: 'center',
    width: 80,
    height: 85
  },
  close: {
    position: 'absolute',
    left: 10
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column'
  },
  containerReview: {
    backgroundColor: DARK_GREY,
    flex: 1,
    flexDirection: 'column'
  },
  date: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  topSection: {
    alignSelf: 'stretch',
    backgroundColor: '#ccffff',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 200,
    paddingVertical: 20
  },
  mapBox: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15
  },
  mapEditIcon: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 20
  },
  observedByText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    paddingLeft: 10
  },
  profileImage: {
    marginLeft: 10,
    marginBottom: 20
  },
  saveButton: {
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: MANGO
  },
  section: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    flex: 1
  },
  sectionReview: {
    borderBottomColor: CHARCOAL,
    borderBottomWidth: 1,
    flex: 1
  },
  sectionText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 15
  },
  stillHappening: {
    color: 'black',
    fontSize: 12,
    fontWeight: '400',
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center'
  },
  textNotes: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
    margin: 20,
    textAlign: 'center'
  },
  textNotesReview: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  time: {
    color: 'grey',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center'
  },
  title: {
    color: 'black',
    fontFamily: 'HelveticaNeue',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: DARK_GREY,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white'
  }
});

const mapboxStyles = MapboxGL.StyleSheet.create({
  point: {
    circleColor: '#5086EC',
    circleRadius: 5,
    circleStrokeColor: '#fff',
    circleStrokeWidth: 2
  },
  observation: {
    circleColor: '#F29D4B',
    circleRadius: 5,
    circleStrokeColor: '#fff',
    circleStrokeWidth: 2
  }
});

class ObservationDetailView extends React.PureComponent<
  Props & StateProps & DispatchProps
> {
  isReviewMode() {
    const { navigation } = this.props;

    return !!(
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.review
    );
  }

  saveObservation = () => {
    const {
      selectedObservation,
      addObservation,
      resetNavigation
    } = this.props;

    if (selectedObservation) {
      addObservation(selectedObservation);
      resetNavigation();
    }
  };

  render() {
    const { navigation, selectedObservation, goToPhotoView } = this.props;
    const reviewMode = this.isReviewMode();
    const keyExtractor = item => item.source;
    let mediaText = '';
    const thereIsMedia =
      selectedObservation &&
      selectedObservation.media &&
      selectedObservation.media.length > 0;
    if (thereIsMedia)
      mediaText = `${
        selectedObservation && selectedObservation.media
          ? selectedObservation.media.length
          : 0
      } Photo`;

    if (!selectedObservation) {
      return <View />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={reviewMode ? styles.containerReview : styles.container}
        >
          {reviewMode && (
            <View style={styles.header}>
              <TouchableHighlight
                style={styles.close}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcon color="gray" name="close" size={25} />
              </TouchableHighlight>
              <Text style={styles.headerTitle}>Revisíon</Text>
            </View>
          )}
          <View style={styles.topSection}>
            {!reviewMode && (
              <TouchableHighlight
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <LeftChevron
                  color="black"
                  name="chevron-left"
                  size={25}
                  style={styles.backChevron}
                />
              </TouchableHighlight>
            )}
            <Image source={CategoryPin} style={styles.categoryPin} />
            <View style={styles.categoryIconContainer}>
              {selectedObservation.icon}
            </View>
            <Text style={styles.title}>{selectedObservation.type}</Text>
            <Text style={styles.date}>
              {moment(selectedObservation.created).format('MMMM D, YYYY')}
            </Text>
            <Text style={styles.time}>
              {moment(selectedObservation.created).format('h:mm A')}
            </Text>
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>{mediaText}</Text>
            {!!selectedObservation &&
              !!selectedObservation.media.length && (
                <FlatList
                  horizontal
                  scrollEnabled
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    paddingHorizontal: 10
                  }}
                  contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  keyExtractor={keyExtractor}
                  renderItem={({ item }) => (
                    <TouchableHighlight
                      onPress={() => goToPhotoView(item.source)}
                    >
                      <Image
                        source={{ uri: item.source }}
                        style={{
                          width: 125,
                          height: 125,
                          margin: 10
                        }}
                      />
                    </TouchableHighlight>
                  )}
                  data={selectedObservation.media}
                />
              )}
            <Text
              style={reviewMode ? styles.textNotesReview : styles.textNotes}
            >
              {selectedObservation.notes}
            </Text>
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>0.0 km</Text>
            <View style={{ height: 240 }}>
              <MapboxGL.MapView
                style={styles.mapBox}
                styleURL={MapboxGL.StyleURL.Street}
                zoomLevel={15}
                centerCoordinate={[
                  selectedObservation.lon,
                  selectedObservation.lat
                ]}
              >
                <MapboxGL.ShapeSource
                  key={selectedObservation.id}
                  id={`observations-${selectedObservation.id}`}
                  shape={{
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [
                        selectedObservation.lon,
                        selectedObservation.lat
                      ]
                    },
                    properties: {
                      name: selectedObservation.name
                    }
                  }}
                >
                  <MapboxGL.CircleLayer
                    id={`circles-${selectedObservation.id}`}
                    style={mapboxStyles.point}
                  />
                </MapboxGL.ShapeSource>
              </MapboxGL.MapView>
              {reviewMode && (
                <TouchableHighlight
                  onPress={() => {
                    navigation.navigate('Position');
                  }}
                >
                  <FontAwesomeIcon
                    color="lightgray"
                    name="pencil"
                    size={20}
                    style={styles.mapEditIcon}
                  />
                </TouchableHighlight>
              )}
            </View>
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>Observado por</Text>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                color="lightgray"
                name="user-circle-o"
                size={30}
                style={styles.profileImage}
              />
              <Text style={styles.observedByText}>
                {selectedObservation.observedBy}
              </Text>
            </View>
          </View>
          {reviewMode && <View style={{ height: 75 }} />}
        </ScrollView>
        {reviewMode && (
          <View style={styles.bottomButtonContainer}>
            <TouchableHighlight
              style={styles.cancelButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.bottomButtonText}>Editar</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.saveButton}
              onPress={this.saveObservation}
            >
              <Text style={styles.bottomButtonText}>Guardar</Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(ObservationDetailView);
