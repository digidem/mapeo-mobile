// @flow
import fetch from 'fetch';
import { blankRequest } from './base';

class App {
  static ready = () =>
    blankRequest({
      method: 'GET',
      route: '/ready'
    });
}

export default App;
