// @flow
import React from 'react';
import 'react-native';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import CameraMainView from './CameraMainView';

describe('CameraMainView tests', () => {
  const isFocused = () => true;
  const addListener = () => true;

  test('snapshot', () => {
    const tree = shallow(
      <CameraMainView navigation={{ isFocused, addListener }} />
    );
    expect(tree).toMatchSnapshot();
  });
});
