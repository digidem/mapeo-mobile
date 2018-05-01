// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import CameraView from './CameraView';

describe('CameraView tests', () => {
  const isFocused = () => true;
  const addListener = () => true;
  test('snapshots', () => {
    let tree;
    tree = shallow(<CameraView navigation={{ isFocused, addListener }} />);
    expect(tree).toMatchSnapshot();
  });
});
