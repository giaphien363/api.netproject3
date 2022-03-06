import { CButton, CModal, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

export default function DetailOrder({ visible, onClose, updateStatus }) {
  return (
    <>
      <CModal size="sm" alignment="center" backdrop="static" visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Update status order</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="success"
            onClick={() => {
              updateStatus('approval')
            }}
          >
            Approval
          </CButton>
          <CButton
            color="danger"
            onClick={() => {
              updateStatus('reject')
            }}
          >
            Reject
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

DetailOrder.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired,
}
