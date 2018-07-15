import type { NavigationScreenProp } from 'react-navigation';

export const createNavigationScreenProp = () => {
  return {
    state: {},
    dispatch: jest.fn(),
    addListener: jest.fn(),
    getParam: jest.fn(),
    isFocused: jest.fn(),
    goBack: jest.fn(),
    navigate: jest.fn(),
    setParams: jest.fn()
  };
};
