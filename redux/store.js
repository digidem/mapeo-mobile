import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutablejs'
import { thunk } from 'redux-thunk'

import * as reducers from 'reducers'
import Immutable from 'immutable'

const reducer = combineReducers(reducers)

const state = Immutable.fromJS({})

const store = applyMiddleware(thunk)(createStore)(reducer, state)

export default store
