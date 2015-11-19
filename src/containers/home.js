import React, { PropTypes } from 'react'
import { Motion, spring } from 'react-motion'
import { connect } from 'react-redux'
import Colors from 'material-ui/lib/styles/colors'
import injectTapEventPlugin from 'react-tap-event-plugin'
import distance from 'turf-distance'
import Point from 'turf-point'

import {
  ListView,
  MapView,
  AddButton } from '../components'

injectTapEventPlugin()

const styles = {
  wrapper: {
    backgroundColor: Colors.grey300
  },
  mapWrapper: {
    overflow: 'hidden',
    position: 'relative'
  }
}

function roundedEqual (a, b, {decimalPlaces = 0} = {}) {
  return a.toFixed(decimalPlaces) === b.toFixed(decimalPlaces)
}

class Home extends React.Component {
  state = {
    isMapFullscreen: false
  }

  handleAddObservation = (e) => {
    this.props.onOpen(e, {
      id: 'new',
      type: 'observation'
    })
  }

  switchMapView = (e) => {
    this.setState({
      isMapFullscreen: !this.state.isMapFullscreen
    })
  }

  render () {
    const { windowWidth, windowHeight, onOpen, location, items, params } = this.props
    const { isMapFullscreen } = this.state
    const smallMapHeight = Math.round(windowWidth * 2 / 3)
    const fullScreenMapHeight = windowHeight - 72
    const mapHeight = isMapFullscreen ? fullScreenMapHeight : smallMapHeight
    return (
      <div style={styles.wrapper}>
        <Motion style={{animatedHeight: spring(mapHeight)}}>
          {({animatedHeight}) => {
            // We don't animate the map size, because this causes performance issues
            // We toggle the map size between large and small, and animate the container
            // using the offset to keep the map centered.
            const eventualHeight = roundedEqual(animatedHeight, smallMapHeight) ? smallMapHeight : fullScreenMapHeight
            const offsetY = ((animatedHeight - eventualHeight) / 2).toFixed(1)
            return (
              <div style={{...styles.mapWrapper, height: animatedHeight}}>
                <div style={{transform: `translateY(${offsetY}px)`}}>
                  <MapView
                    height={eventualHeight}
                    location={location}
                    interactive={isMapFullscreen}
                    onClick={this.switchMapView}
                  />
                </div>
              </div>
            )
          }}
        </Motion>
        <AddButton
          onTouchTap={this.handleAddObservation}
        />
        <ListView {...{onOpen, items}} activeId={params.id} />
      </div>
    )
  }
}

Home.propTypes = {
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  location: PropTypes.object,
  items: PropTypes.array,
  onOpen: PropTypes.func,
  params: PropTypes.object
}

function createSelector () {
  const cache = {
    coords: [180, 90]
  }
  return function select (state) {
    const locationCoords = state.location.coords
    let items
    const distanceFromLastLocation = cache.coords && locationCoords ? distance(Point(locationCoords), Point(cache.coords)) : Infinity
    // If the graph has not changed and we haven't moved more than 100m
    // do not change the list of items
    if (state.graph === cache.graph && distanceFromLastLocation < 0.1) {
      items = cache.items
    } else {
      const entities = []
      for (let id in state.graph.entities) {
        entities.push(state.graph.entities[id])
      }
      items = entities.map(entity => {
        return {
          id: entity.id,
          title: entity.tags['category'],
          date: Date.parse(entity.tags['survey:date']),
          distance: locationCoords ? distance(Point(locationCoords), Point(entity.loc)) * 1000 : null
        }
      }).sort((a, b) => a.distance - b.distance)
    }
    cache.coords = state.location.coords
    cache.graph = state.graph
    cache.items = items
    return {
      location: state.location,
      items: items
    }
  }
}

export default connect(createSelector())(Home)
