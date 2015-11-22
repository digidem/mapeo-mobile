import React, { PropTypes } from 'react'
import { ListDivider } from 'material-ui/lib/lists'
import shouldPureComponentUpdate from 'react-pure-render'

import ListItem from './list_item'

const styles = {
  wrapper: {
    backgroundColor: 'white'
  },
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
      <div style={styles.wrapper}>
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
      </div>
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
