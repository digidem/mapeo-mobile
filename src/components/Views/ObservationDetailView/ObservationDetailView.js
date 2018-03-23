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
import type { Observation } from '../../../types/observation';
import { DARK_GREY, MANGO } from '../../../lib/styles';
import CategoryPin from '../../../images/category-pin.png';

export type StateProps = {
  selectedObservation?: Observation
};

export type DispatchProps = {
  goToPhotoView: (photoSource: string) => void,
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
    marginTop: 10,
    marginBottom: 30
  },
  categoryPin: {
    alignSelf: 'center',
    width: 80,
    height: 85,
    position: 'absolute',
    top: 30
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
  positionAtText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400'
  },
  positionText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '700'
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
      } photo`;

    if (!selectedObservation) {
      return <View />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
        >
          <View style={styles.topSection}>
            <TouchableHighlight
              onPress={() => {
                navigation.goBack();
              }}
            >
              <LeftChevron
                color="lightgrey"
                name="chevron-left"
                size={25}
                style={styles.backChevron}
              />
            </TouchableHighlight>
            <Image source={CategoryPin} style={styles.categoryPin} />
            <View style={styles.categoryIconContainer}>
              {selectedObservation.icon}
            </View>
            <Text style={styles.title}>{selectedObservation.type}</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Text style={styles.positionAtText}>at </Text>
              <Text style={styles.positionText}>{`${selectedObservation.lat}, ${selectedObservation.lon}.`}</Text>
            </View>
            <Text style={styles.time}>
              on {moment(selectedObservation.created).format('MMMM D, h:hh A')}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>{mediaText}</Text>
            {!!selectedObservation &&
              !!selectedObservation.media.length && (
                <FlatList
                  horizontal
                  scrollEnabled
                  style={{
                    flex: 1,
                    flexDirection: 'column'
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
                          margin: 1
                        }}
                      />
                    </TouchableHighlight>
                  )}
                  data={selectedObservation.media}
                />
              )}
            <Text
              style={styles.textNotes}
            >
              {selectedObservation.notes}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>0.0 km away</Text>
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
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>Observed by</Text>
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
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(ObservationDetailView);
