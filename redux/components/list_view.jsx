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

function select (state) {
  const entities = []
  for (let id in state.graph.entities) {
    entities.push(state.graph.entities[id])
  }
  return {
    items: entities.map(entity => {
      return {
        title: entity.tags['category'],
        date: Date.parse(entity.tags['survey:date']),
        distance: distance(Point(state.location), Point(entity.loc))
      }
    }).sort((a, b) => a.distance - b.distance)
  }
}

export default connect(select)(ListView)
