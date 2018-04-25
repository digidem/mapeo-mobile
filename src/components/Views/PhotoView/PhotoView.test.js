// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import PhotoView from './PhotoView';
import { createObservation } from '../../../mocks/observations';

describe('PhotoView tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;

    let tree;
    tree = renderer.create(
      <PhotoView
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
