// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SavedModal from './SavedModal';
import { createObservation } from '../../../mocks/observations';
import { createCategory } from '../../../mocks/categories';

describe('SavedModal tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const categories = {
      [observation.categoryId]: createCategory()
    };
    const icons = {
      [createCategory().icon]: 'icon'
    };
    const onHide = jest.fn();

    const props = [{ observation }];

    let tree;
    props.forEach(p => {
      tree = renderer
        .create(
          <SavedModal
            selectedObservation={p.observation}
            onHide={onHide}
            categories={categories}
            icons={icons}
            gpsFormat="utm"
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
