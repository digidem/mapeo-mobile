var test = require('tape')
var React = require('react/addons')
// var TestUtils = React.addons.TestUtils
var Hello = require('../')

test('Hello#renderToStaticMarkup', function (t) {
  t.equal(React.renderToStaticMarkup(Hello()), '<div>Hello</div>', 'Renders to static markup')
  t.end()
})
