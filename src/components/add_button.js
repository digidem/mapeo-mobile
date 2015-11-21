import React, { PropTypes } from 'react'
import { ListItem } from 'material-ui/lib/lists'
import Avatar from 'material-ui/lib/avatar'
import AddIcon from 'material-ui/lib/svg-icons/content/add'
import HelpIcon from 'material-ui/lib/svg-icons/action/help'
import IconButton from 'material-ui/lib/icon-button'
import Colors from 'material-ui/lib/styles/colors'
import shouldPureComponentUpdate from 'react-pure-render/function'

const styles = {
  wrapper: {
    marginBottom: 15,
    position: 'relative',
    backgroundColor: 'white'
  },
  listItem: {
    height: 72,
    backgroundColor: null
  },
  text: {
    paddingTop: 9
  }
}

class AddButton extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render () {
    const { onTouchTap } = this.props
    return (
      <div

        style={styles.wrapper}

      >
        <ListItem
          style={styles.listItem}
          leftAvatar={<Avatar
            backgroundColor={Colors.red500}
            icon={<AddIcon />}
          />}
          rightIconButton={<IconButton
            tooltip={'Help'} touch>
            <HelpIcon color={Colors.grey400}/>
          </IconButton>}
          primaryText={
            <div style={styles.text}>I see...</div>
          }
          secondaryText={' '}
          onTouchTap={onTouchTap}
          disableTouchRipple
        />
      </div>
    )
  }
}

AddButton.propTypes = {
  onTouchTap: PropTypes.func
}

export default AddButton
