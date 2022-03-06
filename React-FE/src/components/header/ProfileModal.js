import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
} from '@coreui/react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { employeeAPI } from 'src/apis'

export function ProfileModal({ employee, visible, funcShow }) {
  const [success, setSuccess] = useState(false)

  const initialValues = {
    firstName: employee.firstname,
    lastName: employee.lastname,
    address: employee.address,
    phone: employee.phone,
    city: employee.city,
    country: employee.country,
    designation: employee.designation,
  }

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: initialValues })
    }
  }, [visible])

  const handleSubmit = async (values) => {
    try {
      const res = await employeeAPI.updateEmployee(employee.id, values)
      notifySuccess('Your information have changed')
    } catch (err) {
      console.log(err.response.data.detail)
    }
  }

  const notifySuccess = (message) => {
    setSuccess(message)
    let timeout = setTimeout(() => {
      setSuccess('')
      clearTimeout(timeout)
    }, 3000)
  }

  const closeModal = () => {
    funcShow(false)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: profileSchema,
    onSubmit: handleSubmit,
  })

  return (
    <>
      <CModal size="lg" alignment="center" backdrop="static" visible={visible} onClose={closeModal}>
        <CModalHeader onClose={closeModal}>
          <CModalTitle>{employee.username}&rsquo;s profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {success && <CAlert color="success">{success}</CAlert>}
          <CForm noValidate id="profileForm" className="row needs-validation">
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="firstName">
                First name
              </CFormLabel>
              <CFormInput
                id="firstName"
                aria-label="First name"
                type="text"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                invalid={formik.touched.firstName && Boolean(formik.errors.firstName)}
              />
              {formik.touched.firstName && (
                <CFormFeedback invalid>{formik.errors.firstName}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="lastName">
                Last name
              </CFormLabel>
              <CFormInput
                id="lastName"
                aria-label="Last name"
                type="text"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                invalid={formik.touched.lastName && Boolean(formik.errors.lastName)}
              />
              {formik.touched.lastName && (
                <CFormFeedback invalid>{formik.errors.lastName}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="phoneProfile">
                Phone
              </CFormLabel>
              <CFormInput
                id="phoneProfile"
                aria-label="Phone number"
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                invalid={formik.touched.phone && Boolean(formik.errors.phone)}
              />
              {formik.touched.phone && <CFormFeedback invalid>{formik.errors.phone}</CFormFeedback>}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="designation">
                Designation
              </CFormLabel>
              <CFormInput
                id="designation"
                aria-label="Designation"
                type="text"
                name="designation"
                value={formik.values.designation}
                onChange={formik.handleChange}
                invalid={formik.touched.designation && Boolean(formik.errors.designation)}
              />
              {formik.touched.designation && (
                <CFormFeedback invalid>{formik.errors.designation}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="country">
                Country
              </CFormLabel>
              <CFormInput
                id="country"
                aria-label="Your country"
                type="text"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                invalid={formik.touched.country && Boolean(formik.errors.country)}
              />
              {formik.touched.country && (
                <CFormFeedback invalid>{formik.errors.country}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="city">
                City
              </CFormLabel>
              <CFormInput
                id="city"
                aria-label="Your city"
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                invalid={formik.touched.city && Boolean(formik.errors.city)}
              />
              {formik.touched.city && <CFormFeedback invalid>{formik.errors.city}</CFormFeedback>}
            </CCol>

            <CCol md={12}>
              <CFormLabel className="col-form-label" htmlFor="address">
                Address
              </CFormLabel>
              <CFormInput
                id="address"
                type="text"
                name="address"
                invalid={formik.touched.address && Boolean(formik.errors.address)}
                placeholder="address"
                aria-label="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              {formik.touched.address && (
                <CFormFeedback invalid>{formik.errors.address}</CFormFeedback>
              )}
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => formik.handleSubmit()}>
            Save change
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const profileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  designation: yup.string().required('Designation is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number invalid'
    ),
})

ProfileModal.propTypes = {
  employee: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  funcShow: PropTypes.func.isRequired,
}
