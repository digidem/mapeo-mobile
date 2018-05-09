// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import FieldInput from './FieldInput';
import { createObservation } from '../../../mocks/observations';
import { createField } from '../../../mocks/fields';

describe('FieldInput tests', () => {
  const field = createField();

  test('snapshot', () => {
    const tree = renderer.create(
      <FieldInput
        field={field}
        title="fieldName"
        placeholder="this is some placeholder text"
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
