import React from 'react'
import PropTypes from 'prop-types'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

export default function DeleteConfirmModal({ visible, onClose, onDelete, itemName, itemType }) {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>Are you sure?</CModalTitle>
      </CModalHeader>
      {itemName ? (
        <CModalBody>
          Once you delete the {itemType} &quot;{itemName}&quot;, it cannot be undone.
        </CModalBody>
      ) : (
        <CModalBody>Once you delete this item, it cannot be undone.</CModalBody>
      )}
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onDelete}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

DeleteConfirmModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  itemName: PropTypes.string,
  itemType: PropTypes.string,
}
