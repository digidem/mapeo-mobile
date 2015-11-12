import React from 'react'

const styles = {
  base: {
    backgroundImage: 'url(img/map-placeholder.jpg)'
  },
  small: {
    height: 400
  }
}

const MapView = ({ kind = 'small' }) => (
  <div style={Object.assign({}, styles.base, styles[kind])} />
)

export default MapView
