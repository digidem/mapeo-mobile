/* @flow */
var React = require('react')

var App = React.createClass({
  getInitialState: function () { return { n: 0 } },
  render: function () {
    if (process.env.NODE_ENV === 'development') {
      this.state.isItDev = "yadda é desenvolvimento"
    }
     else {
       this.state.isItDev = 'não é desenvolvimento'
     }
    return <div>
      <h1>clicked {this.state.n} times</h1>
      <h2>E então: {this.state.isItDev}</h2>
      <button onClick={this.handleClick}>Me clica!</button>
    </div>
  },
  handleClick: function () {
    this.setState({ n: this.state.n + 1 })
  }
})
React.render(<App />, document.querySelector('#content'))


console.log(process.env.NODE_ENV)
