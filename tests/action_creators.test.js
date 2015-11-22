import test from 'prova'
import { makeActionCreator } from '../src/action_creators'

test('createAction invariant checks', function (t) {
  const type = 'TEST_ACTION'
  const createAction = makeActionCreator(type)

  t.throws(createAction.bind(null, {'whatever': 'yo'}, true), 'Throws if error is true and payload is not an Error()')
  t.throws(createAction.bind(null, new Error(), false), 'Throws if error is false and payload is an Error()')
  t.end()
})

test('createAction shape', function (t) {
  const type = 'TEST_ACTION'
  const createAction = makeActionCreator(type)
  const testPayload = {couldBe: 'anything'}

  t.equal(createAction(testPayload).type, type, 'type property matches type used to create action')
  t.equal(createAction(testPayload).payload, testPayload, 'payload is passed as payload property')
  t.false(createAction(testPayload).error, 'error property defaults to false')
  t.true(createAction(new Error(), true).error, 'second argument true passed as error property')
  t.end()
})
