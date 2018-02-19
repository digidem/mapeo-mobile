// @flow
import React from 'react';
import { Button, Image, Text, TouchableHighlight, View, ScrollView, StyleSheet } from 'react-native';
import moment from 'moment';
import { NavigationActions, withNavigation } from 'react-navigation';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import type { Observation } from '@types/observation';

import LeftChevron from 'react-native-vector-icons/Entypo';
import ProfileImg from 'react-native-vector-icons/FontAwesome';

type State = {
  showStillHappening: boolean,
};

export type StateProps = {
  observations: {
    [id: string]: Observation,
  },
};

type Props = {
  navigation: NavigationActions;
};

const styles = StyleSheet.create({
  backChevron: {
    marginLeft: 15,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
  },
  date: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    alignSelf: 'stretch',
    backgroundColor: '#ccffff',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 200,
    paddingVertical: 20,
  },
  mapBox: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  observedByText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    paddingLeft: 10,
  },
  profileImage: {
    marginLeft: 10,
    marginBottom: 20,
  },
  section: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    flex: 1,
  },
  sectionText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 15,
  },
  stillHappening: {
    color: 'black',
    fontSize: 12,
    fontWeight: '400',
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
  },
  textNotes: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
    margin: 20,
    textAlign: 'center',
  },
  time: {
    color: 'grey',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },
  title: {
    color: 'black',
    fontFamily: 'HelveticaNeue',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

class ObservationDetailView extends React.PureComponent<Props & StateProps, State> {
  state = { showStillHappening: true };

  dismissStillHappening = () => {
    if (this.state.showStillHappening) this.setState({ showStillHappening: false });
  }

  render() {
    const observation = this.props.observations[this.props.navigation.state.params.id];

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableHighlight onPress={() => { this.props.navigation.navigate('TabBarNavigation'); }}>
            <LeftChevron
              color="black"
              name="chevron-left"
              size={25}
              style={styles.backChevron}
            />
          </TouchableHighlight>
          <Text style={styles.title}>{observation.name}</Text>
          <Text style={styles.date}>{moment(observation.created).format('MMMM D, YYYY')}</Text>
          <Text style={styles.time}>{moment(observation.created).format('h:mm A')}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>2 photos, 1 video</Text>
          <View style={{ flexDirection: 'row', height: 125 }}>
            <View style={{ flex: 1, backgroundColor: 'white' }} />
            <View style={{ flex: 1, backgroundColor: 'blue' }} />
            <View style={{ flex: 1, backgroundColor: 'lightgray' }} />
          </View>
          <Text style={styles.textNotes}>{observation.notes}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>0.0 km</Text>
          <View style={{ height: 200 }}>
            <MapboxGL.MapView
              style={styles.mapBox}
              styleURL={MapboxGL.StyleURL.Street}
              zoomLevel={15}
              centerCoordinate={[11.256, 43.770]}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Observed by</Text>
          <View style={{ flexDirection: 'row' }}>
            <ProfileImg
              color="lightgray"
              name="user-circle-o"
              size={30}
              style={styles.profileImage}
            />
            <Text style={styles.observedByText}>{observation.observedBy}</Text>
          </View>
        </View>
        {
          this.state.showStillHappening ?
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
              <Text style={styles.stillHappening}>Is this still happening here?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button onPress={this.dismissStillHappening} title="Yes" />
                <Button onPress={this.dismissStillHappening} title="No" />
              </View>
            </View> : null
        }
      </ScrollView>
    );
  }
}

export default withNavigation(ObservationDetailView);
