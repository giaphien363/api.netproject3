import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
} from '@coreui/react'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { authAPI } from 'src/apis'

export const ChangePassword = ({ isShow, funcShow }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    repeat: '',
  })
  const [error, setError] = useState()
  const [success, setSuccess] = useState()

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData({ ...formData, [name]: value })
  }
  const onClose = () => {
    setError('')
    setSuccess('')
    setFormData({
      currentPassword: '',
      newPassword: '',
      repeat: '',
    })
    funcShow(false)
  }

  const handleSubmit = async () => {
    if (
      formData.currentPassword.length < 5 ||
      formData.newPassword.length < 5 ||
      formData.repeat.length < 5
    ) {
      setError('Your password must be 5 characters')
      return
    }
    if (formData.newPassword !== formData.repeat) {
      setError('Wrong password')
      return
    }
    // validate
    const data = {
      password: formData.currentPassword,
      newpassword: formData.newPassword,
    }
    try {
      const res = await authAPI.changePassword(data)
      setError('')
      setSuccess('Change password successfully')
      setFormData({
        currentPassword: '',
        newPassword: '',
        repeat: '',
      })
    } catch (err) {
      setError(err.response.data.detail)
    }
  }

  return (
    <>
      <CModal alignment="center" backdrop="static" visible={isShow} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}
          <CForm noValidate id="changePass" className="row needs-validation">
            <CCol md={12} className="mb-3">
              <CFormInput
                id="currentPassword"
                type="password"
                name="currentPassword"
                placeholder="Current password"
                aria-label="Input current password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12} className="mb-3">
              <CFormInput
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="New password"
                aria-label="Input new password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                id="repeat"
                type="password"
                name="repeat"
                placeholder="Repeat new password"
                aria-label="Repeat new password"
                value={formData.repeat}
                onChange={handleChange}
              />
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Save Change
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

ChangePassword.propTypes = {
  isShow: PropTypes.bool.isRequired,
  funcShow: PropTypes.func.isRequired,
}
