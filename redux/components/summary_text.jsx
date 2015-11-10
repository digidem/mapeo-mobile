import React, { PropTypes } from 'react'
import { defineMessages, FormattedMessage, FormattedTime } from 'react-intl'

const messages = defineMessages({
  away: {
    id: 'listitem.summary.away',
    defaultMessage: '{distance}{unit} away'
  }
})

const SummaryText = ({ distance, date, style }) => {
  let unit = 'm'
  if (distance >= 1000) {
    distance = distance / 1000
    unit = 'km'
  }
  return (
    <div style={style}>
      <FormattedTime
        value={date}
        format='short'
      />
      <br />
      <FormattedMessage
        {...messages.away}
        values={{ distance, unit }}
      />
    </div>
  )
}

SummaryText.propTypes = {
  distance: PropTypes.number,
  date: PropTypes.number,
  style: PropTypes.object
}

export default SummaryText
