import React, { PropTypes } from 'react'
import { ListItem } from 'material-ui/lib/lists'
import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import AddIcon from 'material-ui/lib/svg-icons/content/add'
import HelpIcon from 'material-ui/lib/svg-icons/action/help'
import IconButton from 'material-ui/lib/icon-button'
import Colors from 'material-ui/lib/styles/colors'

const styles = {
  wrapper: {
    marginBottom: 15,
    zIndex: 1,
    position: 'relative'
  },
  listItem: {
    height: 72,
    backgroundColor: null
  },
  text: {
    paddingTop: 9
  }
}

const AddButton = ({ onTouchTap }) => (
  <Paper
    rounded={false}
    style={styles.wrapper}
    zIndex={1}
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
    />
  </Paper>
)

AddButton.propTypes = {
  onTouchTap: PropTypes.func
}

export default AddButton
