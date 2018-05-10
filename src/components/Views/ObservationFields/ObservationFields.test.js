// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationFields from './ObservationFields';
import { createObservation } from '../../../mocks/observations';
import { createField } from '../../../mocks/fields';

jest.mock('../../Base/FieldInput', () => () => null);

describe('ObservationFields tests', () => {
  const observation = createObservation();
  const isFocused = () => true;
  const addListener = () => true;
  const allFields = [createField()];

  test('snapshot', () => {
    const tree = renderer.create(
      <ObservationFields
        allFields={allFields}
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
