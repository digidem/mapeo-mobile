// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput
} from 'react-native';
import ForwardIcon from 'react-native-vector-icons/Feather';
import CloseIcon from 'react-native-vector-icons/MaterialIcons';
import type { Category } from '@types/category';
import { DARK_GREY, LIGHT_GREY, CHARCOAL, WHITE, MANGO } from '@lib/styles';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  category?: Category
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
    backgroundColor: MANGO
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
    color: DARK_GREY,
    fontWeight: '600'
  },
  mediaList: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center'
  }
});

class ObservationEditor extends React.PureComponent<Props & StateProps, State> {
  constructor() {
    super();

    this.state = { text: '' };
  }

  handleTextInputChange = text => {
    this.setState({ text });
  };

  renderHeader = () => {
    const { navigation } = this.props;

    return (
      <View style={styles.header}>
        <TouchableHighlight
          style={styles.close}
          onPress={() => navigation.goBack()}
        >
          <CloseIcon color="gray" name="close" size={25} />
        </TouchableHighlight>
        <Text style={styles.title}>Observaciones</Text>
        <TouchableHighlight style={styles.forward}>
          <ForwardIcon color="white" name="arrow-right" size={25} />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const { category, navigation } = this.props;
    const { text } = this.state;

    if (!category) {
      navigation.goBack();
      return <View />;
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={{ flex: 1 }}>
          <View style={styles.categoryRow}>
            <View style={styles.map} />
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            placeholder="?Qué está pasando aquí"
            placeholderTextColor={DARK_GREY}
            underlineColorAndroid={DARK_GREY}
            multiline
            autoGrow
          />
          <TouchableHighlight
            style={styles.mediaList}
            onPress={() => navigation.navigate('TabBarNavigation')}
          >
            <Text style={styles.cameraText}>No hay fotos. ?Toma algunos?</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default withNavigation(ObservationEditor);
