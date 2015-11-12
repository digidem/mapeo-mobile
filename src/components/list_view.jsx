import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { ListDivider } from 'material-ui/lib/lists'
import Paper from 'material-ui/lib/paper'
import distance from 'turf-distance'
import Point from 'turf-point'

import { ListItem } from './'

const ListView = ({ items = [], onOpen }) => (
  <Paper zIndex={1}>
    {items.map((item = {}, id) => (
      <div key={id}>
        <ListItem
          onTouchTap={e => onOpen(e, {id, type: 'observation'})}
          {...item }
        />
        <ListDivider />
      </div>
    ))}
  </Paper>
)

ListView.propTypes = {
  items: PropTypes.array,
  onOpen: PropTypes.func
}

function createSelector () {
  const cache = {
    location: [180, 90]
  }
  return function select (state) {
    const distanceFromLastLocation = cache.location ? distance(Point(state.location), Point(cache.location)) : Infinity
    // If the graph has not changed and we haven't moved more than 100m
    // do not change the list of items
    if (state.graph === cache.graph && distanceFromLastLocation < 0.1) {
      return cache.items
    }
    const entities = []
    for (let id in state.graph.entities) {
      entities.push(state.graph.entities[id])
    }

    cache.items = {
      items: entities.map(entity => {
        return {
          title: entity.tags['category'],
          date: Date.parse(entity.tags['survey:date']),
          distance: distance(Point(state.location), Point(entity.loc)) * 1000
        }
      }).sort((a, b) => a.distance - b.distance)
    }
    cache.location = state.location
    cache.graph = state.graph
    return cache.items
  }
}

export default connect(createSelector())(ListView)
