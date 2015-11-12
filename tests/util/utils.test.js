import test from 'prova'
import { prefixTags } from '../../src/util/utils'

test('Prefix Tags', function (t) {
  const obj = {
    a: 1,
    b: { e: 4 },
    c: [ 5, 6 ],
    d: 'hello world'
  }
  const expectedResult = {
    'myprefix:a': 1,
    'myprefix:b': { e: 4 },
    'myprefix:c': [ 5, 6 ],
    'myprefix:d': 'hello world'
  }
  const expectedResultBlacklist = {
    'myprefix:a': 1,
    'myprefix:b': { e: 4 },
    'myprefix:c': [ 5, 6 ]
  }
  t.deepEqual(prefixTags(obj, {prefix: 'myprefix'}), expectedResult, 'Prefixes object tags')
  t.deepEqual(prefixTags(obj, {prefix: 'myprefix', blacklist: ['d']}), expectedResultBlacklist, 'Excludes any blacklisted tags from result')
  t.end()
})
