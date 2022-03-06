import React from 'react'
import PropTypes from 'prop-types'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

export default function SimpleToast({ message, variant = 'success' }) {
  return (
    <CToast visible={true} color={variant} className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>{message}</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )
}

SimpleToast.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.string,
}
