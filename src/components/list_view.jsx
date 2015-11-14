import React, { PropTypes } from 'react'
import { ListDivider } from 'material-ui/lib/lists'
import Paper from 'material-ui/lib/paper'

import { ListItem } from './'

const styles = {
  listItemSelected: {
    backgroundColor: 'lightgrey'
  }
}

const ListView = ({ items = [], onOpen, activeId }) => (
  <Paper zIndex={1}>
    {items.map((item = {}) => (
      <div key={item.id}>
        <ListItem
          style={activeId === item.id ? styles.listItemSelected : {}}
          onTouchTap={e => onOpen(e, {id: item.id, type: 'observation'})}
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
