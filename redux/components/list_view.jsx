import React, { PropTypes } from 'react'
import { ListDivider } from 'material-ui/lib/lists'
import Paper from 'material-ui/lib/paper'
import { ListItem } from './'

const itemsFixture = [
  {
    title: 'Contamination',
    date: 1447050187800,
    distance: 10
  },
  {
    title: 'Hunting Camp',
    date: 1446940177800,
    distance: 150
  },
  {
    title: 'River',
    date: 1446930187800,
    distance: 700
  },
  {
    title: 'Oil Spill',
    date: 1446945187800,
    distance: 1400
  },
  {
    title: 'Contamination',
    date: 1446830187800,
    distance: 1410
  },
  {
    title: 'Hunting Camp',
    date: 1446735187800,
    distance: 1500
  },
  {
    title: 'River',
    date: 1446645187800,
    distance: 3000
  },
  {
    title: 'Oil Spill',
    date: 1446534187800,
    distance: 3200
  },
  {
    title: 'Contamination',
    date: 1446020187800,
    distance: 3250
  },
  {
    title: 'Hunting Camp',
    date: 1446010187800,
    distance: 5000
  },
  {
    title: 'River',
    date: 1445845187800,
    distance: 5100
  },
  {
    title: 'Oil Spill',
    date: 1445540187800,
    distance: 5200
  },
  {
    title: 'Contamination',
    date: 1445430187800,
    distance: 5220
  }
]

const ListView = ({ items = itemsFixture, onOpen }) => (
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

export default ListView
