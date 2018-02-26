// @flow
import React from 'react';
import {
  Button,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { NavigationActions, withNavigation } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import type { Observation } from '@types/observation';
import {
  CHARCOAL,
  DARK_GREY,
  LIGHT_GREY,
  MANGO
} from '@lib/styles';

import LeftChevron from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

type State = {
  showStillHappening: boolean
};

export type StateProps = {
  selectedObservation?: Observation
};

type Props = {
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
  editIcon: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 20
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
    color: 'grey'
  }
});

class ObservationDetailView extends React.PureComponent<
  Props & StateProps,
  State
> {
  state = { showStillHappening: true };

  isReviewMode() {
    const { navigation } = this.props;

    return !!(
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.review
    );
  }

  dismissStillHappening = () => {
    if (this.state.showStillHappening) {
      this.setState({ showStillHappening: false });
    }
  };

  render() {
    const { navigation, selectedObservation } = this.props;
    const reviewMode = this.isReviewMode();

    if (!selectedObservation) {
      return <View />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={reviewMode ? styles.containerReview : styles.container}>
          {reviewMode && (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Review</Text>
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
            <Text style={styles.title}>{selectedObservation.name}</Text>
            <Text style={styles.date}>
              {moment(selectedObservation.created).format('MMMM D, YYYY')}
            </Text>
            <Text style={styles.time}>
              {moment(selectedObservation.created).format('h:mm A')}
            </Text>
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>2 photos, 1 video</Text>
            <View style={{ flexDirection: 'row', height: 125 }}>
              <View style={{ flex: 1, backgroundColor: 'white' }} />
              <View style={{ flex: 1, backgroundColor: 'blue' }} />
              <View style={{ flex: 1, backgroundColor: 'lightgray' }} />
            </View>
            <Text style={reviewMode ? styles.textNotesReview : styles.textNotes}>{selectedObservation.notes}</Text>
            {reviewMode && (
              <TouchableHighlight
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <FontAwesomeIcon
                  color="lightgray"
                  name="pencil"
                  size={20}
                  style={styles.editIcon}
                />
              </TouchableHighlight>
            )}
          </View>
          <View style={reviewMode ? styles.sectionReview : styles.section}>
            <Text style={styles.sectionText}>0.0 km</Text>
            <View style={{ height: 240 }}>
              <MapboxGL.MapView
                style={styles.mapBox}
                styleURL={MapboxGL.StyleURL.Street}
                zoomLevel={15}
                centerCoordinate={[11.256, 43.77]}
              />
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
          {reviewMode && (
            <View style={{ height: 75 }}></View>
          )}
          {!reviewMode && this.state.showStillHappening ? (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
              <Text style={styles.stillHappening}>
                Is this still happening here?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button onPress={this.dismissStillHappening} title="Yes" />
                <Button onPress={this.dismissStillHappening} title="No" />
              </View>
            </View>
          ) : null}
        </ScrollView>
        {reviewMode && (
          <View style={styles.bottomButtonContainer}>
            <TouchableHighlight
              style={styles.cancelButton}
              onPress={() => {
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'TabBarNavigation' })]
                });
                navigation.dispatch(resetAction);
              }}
            >
              <Text style={styles.bottomButtonText}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.saveButton}
              onPress={() => {
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'TabBarNavigation' })]
                });
                navigation.dispatch(resetAction);
              }}
            >
              <Text style={styles.bottomButtonText}>Save</Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(ObservationDetailView);
