// @flow
import React from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet
} from 'react-native';
import moment from '../../../lib/localizedMoment';
import { withNavigationFocus } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import I18n from 'react-native-i18n';
import type { Observation } from '../../../types/observation';
import { DARK_GREY, MEDIUM_GREY, MANGO } from '../../../lib/styles';
import CategoryPin from '../../../images/category-pin.png';
import PencilIcon from '../../../images/editor-details.png';

export type StateProps = {
  selectedObservation?: Observation
};

export type DispatchProps = {
  goToEditorView: () => void,
  goToPhotoView: (params: Object) => void,
  addObservation: (o: Observation) => void,
  goBack: () => void
};

export type Props = {
  isFocused: boolean
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
  fieldAnswer: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 7,
    marginBottom: 15
  },
  fieldTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: '700'
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
    color: 'black',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 15,
    marginLeft: 10,
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
  topSection: {
    alignSelf: 'stretch',
    backgroundColor: '#ccffff',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 200,
    paddingVertical: 20
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

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ObservationDetailView extends React.Component<
  Props & StateProps & DispatchProps
> {
  shouldComponentUpdate(nextProps: Props & StateProps & DispatchProps) {
    if (nextProps.isFocused) {
      return nextProps !== this.props;
    }

    return false;
  }

  saveObservation = () => {
    const { selectedObservation, addObservation } = this.props;

    if (selectedObservation) {
      addObservation(selectedObservation);
    }
  };

  render() {
    const {
      selectedObservation,
      goToEditorView,
      goToPhotoView,
      goBack
    } = this.props;
    const keyExtractor = item => item.source.toString();
    let mediaTitle = null;
    let mediaText = `0 ${I18n.t('detail_view.photo')}s`;
    const numOfMedia =
      selectedObservation && selectedObservation.media
        ? selectedObservation.media.length
        : null;
    if (numOfMedia && numOfMedia > 0) {
      mediaText = `${numOfMedia} ${I18n.t('detail_view.photo')}`;
      if (numOfMedia && numOfMedia > 1) {
        mediaText = `${mediaText}s`;
      }
      mediaTitle = (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 15
          }}
        >
          <MaterialIcon color={MEDIUM_GREY} name="photo-camera" size={15} />
          <Text style={styles.sectionText}>{mediaText}</Text>
        </View>
      );
    }
    if (!selectedObservation) {
      return <View />;
    }
    const latLonText = `${selectedObservation.lat}, ${selectedObservation.lon}`;
    const fields = selectedObservation.fields.map(f => (
      <View key={f.name} style={{ marginLeft: 15 }}>
        <Text style={styles.fieldTitle}>{f.name}</Text>
        <Text style={styles.fieldAnswer}>
          {f.answered ? f.answer : I18n.t('detail_view.not_entered')}
        </Text>
      </View>
    ));
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.topSection}>
            <TouchableOpacity onPress={goBack} underlayColor="transparent">
              <EntypoIcon
                color="lightgrey"
                name="chevron-left"
                size={25}
                style={styles.backChevron}
              />
            </TouchableOpacity>
            <Image source={CategoryPin} style={styles.categoryPin} />
            <TouchableOpacity
              onPress={() => goToEditorView()}
              style={{ position: 'absolute', right: 20, top: 25 }}
            >
              <Image source={PencilIcon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
            <View style={styles.categoryIconContainer}>
              <Image
                source={selectedObservation.icon}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>
              {I18n.t(`categories.${selectedObservation.categoryId}`)}
            </Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Text style={styles.positionAtText}>{I18n.t('at')} </Text>
              <Text style={styles.positionText}>
                {`${selectedObservation.lat}, ${selectedObservation.lon}.`}
              </Text>
            </View>
            <Text style={styles.time}>
              {I18n.t('on')}{' '}
              {moment(selectedObservation.created).format('MMMM D, h:hh A')}
            </Text>
          </View>
          <View style={styles.section}>
            {mediaTitle}
            {!!selectedObservation &&
              !!selectedObservation.media.length && (
                <FlatList
                  horizontal
                  scrollEnabled
                  style={{
                    flex: 1,
                    flexDirection: 'row'
                  }}
                  contentStyle={{ justifyContent: 'center' }}
                  keyExtractor={keyExtractor}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        goToPhotoView({
                          type: item.type,
                          source: item.source,
                          fromDetailView: true
                        })
                      }
                    >
                      <Image
                        source={{ uri: item.source }}
                        style={{
                          width: 125,
                          height: 125,
                          margin: 1
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  data={selectedObservation.media}
                />
              )}
            <Text style={styles.textNotes}>{selectedObservation.notes}</Text>
          </View>
          <View style={styles.section}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15
              }}
            >
              <EntypoIcon color={MANGO} name="location-pin" size={15} />
              <Text style={styles.sectionText}>{latLonText}</Text>
            </View>
            <View style={{ height: 240 }}>
              <MapboxGL.MapView
                style={styles.mapBox}
                styleURL={MapboxGL.StyleURL.Street}
                zoomLevel={12}
                scrollEnabled={false}
                rotateEnabled={false}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15
              }}
            >
              <Image
                source={PencilIcon}
                style={{ marginLeft: 3, width: 15, height: 15 }}
              />
              <Text style={styles.sectionText}>
                {I18n.t('detail_view.details')}
              </Text>
            </View>
            {fields}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>
              {I18n.t('detail_view.observed_by')}
            </Text>
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

export default withNavigationFocus(ObservationDetailView);
