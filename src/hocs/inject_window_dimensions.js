import React from 'react'
import requestAnimationFrame from 'raf'

/**
 * A Higher-Order Component to inject properties `windowWidth` and
 * `windowHeight` into the wrapped component. They update when the window
 * size changes.
 * @param {React.Component} ComposedComponent
 */
export default function InjectWindowDimensions (ComposedComponent) {
  return class extends React.Component {
    // iOS 9 is a real bugger about this, it reports window.innerHeight and
    // innerWidth incorrectly on first render.
    // https://gist.github.com/baptistebriel/ae67afca884e21b5b425
    updateDimensions = () => {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      })
    }

    // Wait for animation frame to update dimensions (and cause re-render)
    onResize = () => {
      if (this.rqf) return
      this.rqf = requestAnimationFrame(() => {
        this.rqf = null
        this.updateDimensions()
      })
    }

    componentWillMount () {
      this.updateDimensions()
      window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.onResize)
    }

    render () {
      return <ComposedComponent {...this.state} {...this.props}/>
    }
  }
}
