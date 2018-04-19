// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { withNavigationFocus } from 'react-navigation';
import ObservationEditor from './ObservationEditor';
import { createObservation } from '../../../mocks/observations';

describe('ObservationEditor tests', () => {
  const observation = createObservation();

  test('snapshots', () => {
    let tree;
    tree = renderer.create(
      <ObservationEditor
        isFocused
        navigation={withNavigationFocus}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
