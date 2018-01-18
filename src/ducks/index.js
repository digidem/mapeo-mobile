import { combineReducers } from 'redux';
import observations from './observations';

const rootReducer = combineReducers({
  ...observations,
});

export default rootReducer;
