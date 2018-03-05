// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Category } from '../../../types/category';
import type { Observation } from '../../../types/observation';
import {
  DARK_GREY,
  LIGHT_GREY,
  CHARCOAL,
  WHITE,
  MANGO,
  VERY_LIGHT_GREEN,
  MEDIUM_GREY
} from '../../../lib/styles';
import PositionImg from '../../../images/position.png';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  category?: Category,
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  goToObservationDetailReview: () => void
};

type State = {
  text: string
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CHARCOAL
  },
  header: {
    flexDirection: 'row',
    backgroundColor: DARK_GREY,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  close: {
    position: 'absolute',
    left: 10
  },
  forward: {
    position: 'absolute',
    right: 10,
    backgroundColor: MANGO,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: LIGHT_GREY
  },
  categoryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: DARK_GREY
  },
  map: {
    height: 80,
    width: 80,
    backgroundColor: VERY_LIGHT_GREEN,
    justifyContent: 'center'
  },
  positionImg: {
    width: 40,
    height: 47,
    alignSelf: 'center'
  },
  categoryContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  categoryName: {
    fontSize: 15,
    color: WHITE,
    fontWeight: '600'
  },
  textInput: {
    fontSize: 20,
    padding: 20,
    paddingBottom: 30,
    color: WHITE,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  cameraText: {
    fontSize: 15,
    color: MEDIUM_GREY,
    fontWeight: '600'
  },
  mediaList: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center'
  }
});

class ObservationEditor extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor(props: Props & StateProps & DispatchProps) {
    super();

    this.state = {
      text: props.selectedObservation ? props.selectedObservation.notes : ''
    };
  }

  componentDidMount() {
    const { updateObservation, selectedObservation, category } = this.props;

    if (selectedObservation && category) {
      updateObservation({
        ...selectedObservation,
        type: category.name,
        name: category.name
      });
    }
  }

  handleTextInputChange = text => {
    this.setState({ text });
  };

  handleUpdateObservation = () => {
    const {
      updateObservation,
      selectedObservation,
      goToObservationDetailReview
    } = this.props;
    const { text } = this.state;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: text
      });
      goToObservationDetailReview();
    }
  };

  handleTextInputBlur = () => {
    const { selectedObservation, updateObservation } = this.props;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: this.state.text
      });
    }
  };

  renderHeader = () => {
    const { navigation } = this.props;

    return (
      <View style={styles.header}>
        <TouchableHighlight
          style={styles.close}
          onPress={() => navigation.navigate('Categories')}
        >
          <Icon color="gray" name="close" size={25} />
        </TouchableHighlight>
        <Text style={styles.title}>Observaciones</Text>
        <TouchableHighlight
          style={styles.forward}
          onPress={this.handleUpdateObservation}
        >
          <Icon color="white" name="arrow-forward" size={25} />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const { navigation, selectedObservation } = this.props;
    const { text } = this.state;
    // const keyExtractor = item => item.source;

    if (!selectedObservation) {
      navigation.goBack();
      return <View />;
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={{ flex: 1 }}>
          <View style={styles.categoryRow}>
            <View style={styles.map}>
              <Image style={styles.positionImg} source={PositionImg} />
            </View>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryName}>
                {selectedObservation.type}
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            placeholder="?Qué está pasando aquí"
            placeholderTextColor={MEDIUM_GREY}
            underlineColorAndroid={DARK_GREY}
            onBlur={this.handleTextInputBlur}
            multiline
            autoGrow
          />
          {selectedObservation &&
            !!selectedObservation.media.length && (
              <TouchableHighlight
                onPress={() => navigation.navigate('PhotoView')}
              >
                <View
                  style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').width,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    source={{ uri: selectedObservation.media[0].source }}
                    style={{
                      width: Dimensions.get('window').width * 0.75,
                      height: Dimensions.get('window').width * 0.75
                    }}
                  />
                </View>
              </TouchableHighlight>
            )}
          {/* {selectedObservation &&
            !!selectedObservation.media.length && (
              <FlatList
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingVertical: 5,
                  paddingHorizontal: 10
                }}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.source }}
                    style={{ width: 150, height: 150 }}
                  />
                )}
                data={selectedObservation.media}
              />
            )} */}
          {selectedObservation &&
            !selectedObservation.media.length && (
              <TouchableHighlight
                style={styles.mediaList}
                onPress={() => navigation.navigate('CameraView')}
              >
                <Text style={styles.cameraText}>
                  No hay fotos. ?Toma algunos?
                </Text>
              </TouchableHighlight>
            )}
        </View>
      </View>
    );
  }
}

export default withNavigation(ObservationEditor);
