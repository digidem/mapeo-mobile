// @flow
import React from 'react';
import { Button, Image, Text, TouchableHighlight, View, ScrollView, StyleSheet } from 'react-native';
import { map } from 'lodash';
import { NavigationActions, withNavigation } from 'react-navigation';
import type { Observation } from '@types/observation';

import BackImg from '../../../images/left-chevron.png';
import ProfileImg from '../../../images/profile.png';

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
    marginLeft: 20,
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
    backgroundColor: '#e6ffff',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 200,
    paddingVertical: 20,
  },
  map: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  mapText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 15,
  },
  mediaContentText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 15,
  },
  notes: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    flex: 1,
  },
  observedBy: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  observedByText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    paddingLeft: 10,
    paddingTop: 20,
  },
  observedByTitle: {
    color: 'gray',
    fontSize: 12,
  },
  profileImage: {
    marginTop: 20,
    paddingLeft: -5,
    marginBottom: 20,
  },
  textNotes : {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 20,
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
});

const ObservationDetailView = (props: StateProps & Props) => (
  <ScrollView style={styles.container}>
    <View style={styles.header}>
      <TouchableHighlight onPress={() => {props.navigation.navigate('TabBarNavigation')}}>
        <Image source={BackImg} style={styles.backChevron} />
      </TouchableHighlight>
      <Text style={styles.title}>Oil Spill</Text>
      <Text style={styles.date}>December 12, 2017</Text>
      <Text style={styles.time}>12:00 PM</Text>
    </View>
    <View style={styles.notes}>
      <Text style={styles.mediaContentText}>2 photos, 1 video</Text>
      <View style={{flexDirection: 'row', height: 125}}>
        <View style={{flex: 1, backgroundColor: 'white'}}></View>
        <View style={{flex: 1, backgroundColor: 'blue'}}></View>
        <View style={{flex: 1, backgroundColor: 'lightgray'}}></View>
      </View>
      <Text style={styles.textNotes}>This is pretty bad. It smells pretty noxious, and the entire pond is affected.</Text>
    </View>
    <View style={styles.map}>
      <Text style={styles.mapText}>0.0 km</Text>
      <View style={{flexDirection: 'row', height: 200}}>
        <View style={{flex: 1, backgroundColor: 'lightblue', marginBottom: 15, marginLeft: 15, marginRight: 15}}></View>
      </View>
    </View>
    <View style={styles.observedBy}>
      <Text style={styles.observedByTitle}>Observed by</Text>
      <View style={{flexDirection: 'row'}}>
        <Image source={ProfileImg} style={styles.profileImage}/>
        <Text style={styles.observedByText}>You</Text>
      </View>
    </View>
  </ScrollView>
);

export default withNavigation(ObservationDetailView);
