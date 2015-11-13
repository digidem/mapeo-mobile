import React from 'react'
import MapGL from 'react-map-gl'

const MAPBOX_TOKEN='pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg'

const styles = {
  base: {
    backgroundImage: 'url(img/map-placeholder.jpg)'
  },
  small: {
    height: 400
  }
}

const MapView = ({ kind = 'small', containerWidth, coords }) => (
  <MapGL
    width={containerWidth}
    height={styles[kind].height}
    longitude={coords[0]}
    latitude={coords[1]}
    zoom={12}
    mapboxApiAccessToken={MAPBOX_TOKEN}
  />
)

export default MapView
