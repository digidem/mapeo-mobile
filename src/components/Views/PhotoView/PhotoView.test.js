// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import PhotoView from './PhotoView';
import { createObservation } from '../../../mocks/observations';
import { createNavigationScreenProp } from '../../../mocks/navigation';
import { resourcePending } from '../../../lib/resource';

describe('PhotoView tests', () => {
  test('snapshot', () => {
    const observation = createObservation();
    const updateObservation = jest.fn();

    const tree = renderer.create(
      <PhotoView
        navigation={createNavigationScreenProp()}
        selectedObservation={observation}
        updateObservation={updateObservation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
