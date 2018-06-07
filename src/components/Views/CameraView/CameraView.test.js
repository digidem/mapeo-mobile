// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import CameraView from './CameraView';

jest.mock('../ObservationsView', () => () => null);
jest.mock('../MapView', () => () => null);
jest.mock('../../Base/SavedModal', () => () => null);

describe('CameraView tests', () => {
  const isFocused = () => true;
  const addListener = () => true;
  test('snapshots', () => {
    let tree;
    tree = shallow(<CameraView navigation={{ isFocused, addListener }} />);
    expect(tree).toMatchSnapshot();
  });
});
