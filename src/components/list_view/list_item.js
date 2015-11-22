import React, { PropTypes } from 'react'
import { ListItem } from 'material-ui/lib/lists'
import Avatar from 'material-ui/lib/avatar'
import CameraIcon from 'material-ui/lib/svg-icons/image/photo-camera'
import Colors from 'material-ui/lib/styles/colors'

import SummaryText from './summary_text'

const MyListItem = ({ title, date, distance, onTouchTap, style }) => (
  <ListItem
    style={style}
    leftAvatar={<Avatar
      backgroundColor={Colors.blue500}
      icon={<CameraIcon />}
    />}
    primaryText={title}
    secondaryText={<SummaryText distance={distance} date={date} />}
    secondaryTextLines={2}
    onTouchTap={onTouchTap}
    disableTouchRipple
  />
)

MyListItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.number,
  distance: PropTypes.number,
  onTouchTap: PropTypes.func.isRequired,
  style: PropTypes.object
}

export default MyListItem
