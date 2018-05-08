// @flow
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { Observation } from '../../../types/observation';
import type { Field } from '../../../types/field';
import { LIGHT_GREY } from '../../../lib/styles';

interface Props {
  field: Field;
  placeholder: string;
  title: string;
}

export interface StateProps {
  selectObservation?: Observation;
}

export interface DispatchProps {
  updateObservation: (obs: Object) => void;
}

interface State {
  text: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 5,
    fontSize: 20,
    paddingHorizontal: 10,
    marginVertical: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  }
});

class FieldInput extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  state = { text: '' };
  textInput: any;

  componentDidMount() {
    const { field } = this.props;
    if (field.answered) this.setState({ text: field.answer });
    else this.setState({ text: '' });
  }

  updateText = () => {
    const { field, selectedObservation, updateObservation } = this.props;

    const fields = selectedObservation.fields.map(f => {
      if (f.name === field.name) {
        return {
          ...f,
          answered: this.state.text !== '',
          answer: this.state.text
        };
      }
      return f;
    });
    updateObservation({
      ...selectedObservation,
      fields
    });
  };

  render() {
    const { placeholder, title } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          ref={ref => (this.textInput = ref)}
          style={styles.textInput}
          onBlur={this.updateText}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholder={placeholder}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

export default FieldInput;
