// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SavedModal from './SavedModal';
import { createObservation } from '../../../mocks/observations';

describe('SavedModal tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const onHide = jest.fn();

    const props = [{ observation }];

    let tree;
    props.forEach(p => {
      tree = renderer
        .create(
          <SavedModal selectedObservation={p.observation} onHide={onHide} />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
