import React, { PropTypes } from 'react'
import AppBar from 'material-ui/lib/app-bar'
import IconButton from 'material-ui/lib/icon-button'
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close'
import { defineMessages, injectIntl, intlShape } from 'react-intl'

const baseStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  top: 0,
  backgroundColor: 'lightblue'
}

const messages = defineMessages({
  title_existing: {
    id: 'observation_edit.title.existing',
    defaultMessage: 'Observation'
  },
  title_new: {
    id: 'observation_edit.title.new',
    defaultMessage: 'New Observation'
  }
})

const ObservationEdit = ({ onClose, id, intl: {formatMessage}, style }) => {
  const isNew = id === 'new'
  const title = isNew ? formatMessage(messages.title_new)
    : formatMessage(messages.title_existing)
  const closeIcon = <IconButton onTouchTap={onClose}><NavigationClose /></IconButton>

  return (
    <div style={Object.assign({}, baseStyle, style)}>
      <AppBar
        title={title}
        iconElementLeft={closeIcon}
      />
      id: {id}
    </div>
  )
}

ObservationEdit.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(ObservationEdit)
