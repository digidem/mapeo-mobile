let test = require('tape')
import store from '../redux/store'
import * as actions from '../redux/actions/actions'

test('Store testing', function (t) {
  t.plan(2)

  console.log('\n\n\n\n\n===========')
  console.log(store)

  t.ok(store, 'Store exists')
  store.dispatch(actions.placeAdd(
    'casa do Pai Tomás',
    -23.73454,
    -47.987
  ))

  console.log('\n\n\n\n\n===========')
  console.log(store.getState())
  t.ok(store, 'Must change this test')
})
