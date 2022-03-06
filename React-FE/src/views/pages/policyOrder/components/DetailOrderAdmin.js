import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

export default function DetailOrder({ visible, onClose, item }) {
  return (
    <>
      <CModal size="lg" alignment="center" backdrop="static" visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Detail Policy Order</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              Employee name: {item.employeeRes.firstname + item.employeeRes.lastname}
            </CCol>
            <CCol md={6}>Employee phone: {item.employeeRes.phone}</CCol>
            <CCol md={6}>Employee designation: {item.employeeRes.designation}</CCol>
            <CCol md={6}>Employee salary: {item.employeeRes.salary}$</CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol md={6}>Policy name: {item.policyRes.name}</CCol>
            <CCol md={6}>Support percent: {item.policyRes.supportPercent}</CCol>
            <CCol md={6}>Duration (Days): {item.policyRes.durationInDays}</CCol>
            <CCol md={6}>Price: {item.policyRes.price}$</CCol>
            <CCol md={12}>
              Description:
              <br />
              {item.policyRes.description}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

DetailOrder.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}
