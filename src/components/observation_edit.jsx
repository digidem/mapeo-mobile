import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/lib/app-bar'
import IconButton from 'material-ui/lib/icon-button'
import List from 'material-ui/lib/lists/list'
import ListDivider from 'material-ui/lib/lists/list-divider'
import ListItem from 'material-ui/lib/lists/list-item'
import RaisedButton from 'material-ui/lib/raised-button'
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close'
import LocationIcon from 'material-ui/lib/svg-icons/maps/my-location'
import CategoryIcon from 'material-ui/lib/svg-icons/file/folder'
import MediaIcon from 'material-ui/lib/svg-icons/image/photo-camera'
import DetailsIcon from 'material-ui/lib/svg-icons/editor/mode-edit'
import RightIcon from 'material-ui/lib/svg-icons/navigation/chevron-right'

import { defineMessages, injectIntl, intlShape } from 'react-intl'

const styles = {
  wrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
  },
  listItem: {
    lineHeight: '40px'
  },
  listIcon: {
    top: 12
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '72px'
  },
  saveButtonLabel: {
    fontSize: '36px',
    lineHeight: '72px'
  }
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

const ObservationEdit = ({ onClose, id, observation, intl: {formatMessage}, style }) => {
  const isNew = id === 'new'
  const title = isNew ? formatMessage(messages.title_new)
    : formatMessage(messages.title_existing)
  const closeIcon = <IconButton onTouchTap={onClose}><CloseIcon /></IconButton>

  const LocationText = (observation)
    ? observation.gps.loc[0].toFixed(4) + ', ' + observation.gps.loc[1].toFixed(4)
    : 'Waiting for location fix...'

  return (
    <div style={Object.assign({}, styles.wrapper, style)}>
      <AppBar
        title={title}
        iconElementLeft={closeIcon}
      />
      <List>
        <ListItem
          style={styles.listItem}
          primaryText={LocationText}
          leftIcon={<LocationIcon style={styles.listIcon} />}
          rightIcon={<RightIcon style={styles.listIcon} />}
        />
        <ListDivider inset />
        <ListItem
          style={styles.listItem}
          primaryText='Category'
          leftIcon={<CategoryIcon style={styles.listIcon} />}
          rightIcon={<RightIcon style={styles.listIcon} />}
        />
        <ListDivider inset />
        <ListItem
          style={styles.listItem}
          primaryText='Add Photo...'
          leftIcon={<MediaIcon style={styles.listIcon} />}
          rightIcon={<RightIcon style={styles.listIcon} />}
        />
        <ListDivider inset />
        <ListItem
          style={styles.listItem}
          primaryText='Details'
          leftIcon={<DetailsIcon style={styles.listIcon} />}
          rightIcon={<RightIcon style={styles.listIcon} />}
        />
        <ListDivider inset />
      </List>
      <RaisedButton primary label='SAVE' style={styles.saveButton} labelStyle={styles.saveButtonLabel} />
    </div>
  )
}

ObservationEdit.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  observation: PropTypes.object,
  intl: intlShape.isRequired
}

function createSelector () {
  let cache = {}
  const empty = {}
  return function select (state, {id} = {}) {
    if (id === 'new') {
      return empty
    }
    let observationJSON = cache.id === id ? cache.observationJSON
      : state.graph.entities[id].asJSON()
    cache = { id, observationJSON }
    return {
      observation: observationJSON
    }
  }
}

export default connect(createSelector())(injectIntl(ObservationEdit))
