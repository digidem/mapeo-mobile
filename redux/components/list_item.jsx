import React, { PropTypes } from 'react'
import {
  FormattedTime,
  FormattedNumber,
  FormattedMessage
} from 'react-intl'
import { ListItem } from 'material-ui/lib/lists'
import Avatar from 'material-ui/lib/avatar'
import CameraIcon from 'material-ui/lib/svg-icons/image/photo-camera'
import Colors from 'material-ui/lib/styles/colors'
import { SummaryText } from './'

const MyListItem = ({ title, date, distance, onTouchTap }) => (
  <ListItem
    leftAvatar={<Avatar
      backgroundColor={Colors.blue500}
      icon={<CameraIcon />}
    />}
    primaryText={title}
    secondaryText={<SummaryText distance={distance} date={date} />}
    secondaryTextLines={2}
    onTouchTap={onTouchTap}
  />
)

MyListItem.propTypes = {
  title: PropTypes.string,
  date: PropTypes.number,
  distance: PropTypes.number,
  onTouchTap: PropTypes.func
}

export default MyListItem
