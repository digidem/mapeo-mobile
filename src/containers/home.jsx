import React, { PropTypes } from 'react'
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

const style = {
  backgroundColor: Colors.grey300,
  position: 'absolute',
  overflowX: 'hidden',
  overflowY: 'scroll',
  width: '100%',
  height: '100%',
  WebkitOverflowScrolling: 'touch'
}

class Home extends React.Component {
  handleAddObservation = (e) => {
    this.props.onOpen(e, {
      id: 'new',
      type: 'observation'
    })
  }

  render () {
    const { containerWidth, containerHeight, onOpen, location, items, params } = this.props
    return (
      <div style={style}>
        <MapView {...{containerWidth, containerHeight, location}} kind='small' />
        <AddButton
          onTouchTap={this.handleAddObservation}
        />
        <ListView {...{onOpen, items}} activeId={params.id} />
      </div>
    )
  }
}

Home.propTypes = {
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
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
    let items
    const distanceFromLastLocation = cache.coords ? distance(Point(state.location.coords), Point(cache.coords)) : Infinity
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
          distance: distance(Point(state.location.coords), Point(entity.loc)) * 1000
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
