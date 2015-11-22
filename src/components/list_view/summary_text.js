import React, { PropTypes } from 'react'
import { defineMessages, FormattedMessage, FormattedTime } from 'react-intl'

const messages = defineMessages({
  away: {
    id: 'listitem.summary.away',
    defaultMessage: '{distance}{unit} away'
  },
  geolocation_not_available: {
    id: 'listitem.summary.geolocation_not_available',
    defaultMessage: 'Geolocation is turned off'
  }
})

const SummaryText = ({ distance, date, style }) => {
  let unit = 'm'
  // If geolocation is not available, distance will be a null value
  let message
  if (distance) {
    if (distance >= 1000) {
      distance = distance / 1000
      unit = 'km'
    }
    distance = distance.toFixed(1)
    message = <FormattedMessage {...messages.away} values={{ distance, unit }} />
  } else {
    message = <FormattedMessage {...messages.geolocation_not_available} />
  }
  return (
    <div style={style}>
      <FormattedTime
        value={date}
        format='short'
      />
      <br />
      {message}
    </div>
  )
}

SummaryText.propTypes = {
  distance: PropTypes.number,
  date: PropTypes.number,
  style: PropTypes.object
}

export default SummaryText
