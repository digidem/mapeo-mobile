import React, { PropTypes } from 'react'
import { ListDivider } from 'material-ui/lib/lists'
import Paper from 'material-ui/lib/paper'
import shouldPureComponentUpdate from 'react-pure-render'

import { ListItem } from './'

const styles = {
  listItemSelected: {
    backgroundColor: 'lightgrey'
  }
}

class ListView extends React.Component {
  static defaultProps = {
    items: []
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render () {
    const { items, onOpen, activeId } = this.props
    return (
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
  }
}

ListView.propTypes = {
  items: PropTypes.array,
  onOpen: PropTypes.func,
  activeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default ListView
