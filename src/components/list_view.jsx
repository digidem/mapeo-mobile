import React, { PropTypes } from 'react'
import { ListDivider } from 'material-ui/lib/lists'
import Paper from 'material-ui/lib/paper'

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

export default ListView
