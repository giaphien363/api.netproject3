import React from 'react'
import PropTypes from 'prop-types'
import { CTooltip } from '@coreui/react'

import { stringUtils } from 'src/utils'

export default function DateWithTimeTooltip({ dateString }) {
  const { date, time } = stringUtils.getDateTimeObject(dateString)

  return (
    <CTooltip content={time} placement="top">
      <div>{date}</div>
    </CTooltip>
  )
}

DateWithTimeTooltip.propTypes = {
  dateString: PropTypes.string.isRequired,
}
