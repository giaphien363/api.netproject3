import React, { useEffect } from 'react'
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
} from '@coreui/react'
import { useFormik } from 'formik'
import * as yup from 'yup'

export default function CreateOrEditEmployeeModal({
  visible,
  onClose,
  onCreate,
  onUpdate,
  company,
  saveButtonTitle = 'Save',
}) {
  const isEditing = company !== undefined

  const initialValues = {
    username: '',
    password: '',
    salary: 0,
    firstname: '',
    lastname: '',
    joindate: '2022-03-05T15:24:01.480Z',
    designation: '',
    address: '',
    phone: '',
    country: '',
    city: '',
  }

  const formData = isEditing ? company : initialValues

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: formData })
    }
  }, [visible])

  const handleSubmit = (values) => {
    const {
      username,
      password,
      salary,
      firstname,
      lastname,
      joindate,
      designation,
      address,
      phone,
      country,
      city,
    } = values
    const payload = {
      username,
      password,
      salary,
      firstname,
      lastname,
      joindate,
      designation,
      address,
      phone,
      country,
      city,
    }
    if (isEditing) onUpdate(company.id, payload)
    else onCreate(payload)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: companySchema,
    onSubmit: handleSubmit,
  })

  return (
    <>
      <CModal size="lg" alignment="center" backdrop="static" visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>{isEditing ? 'Edit employee' : 'Add a new employee'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate id="addCompanyForm" className="row needs-validation">
            {isEditing ? (
              <>
                <CCol md={12}>
                  <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                    User name
                  </CFormLabel>
                  <CFormInput
                    id="addCompanyNameInput"
                    type="text"
                    name="username"
                    invalid={formik.touched.username && Boolean(formik.errors.username)}
                    placeholder="Name"
                    aria-label="Input company name"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.username && (
                    <CFormFeedback invalid>{formik.errors.username}</CFormFeedback>
                  )}
                </CCol>
              </>
            ) : (
              <>
                <CCol md={6}>
                  <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                    User name
                  </CFormLabel>
                  <CFormInput
                    id="addCompanyNameInput"
                    type="text"
                    name="username"
                    invalid={formik.touched.username && Boolean(formik.errors.username)}
                    placeholder="Name"
                    aria-label="Input company name"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.username && (
                    <CFormFeedback invalid>{formik.errors.username}</CFormFeedback>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                    Password
                  </CFormLabel>
                  <CFormInput
                    id="addCompanyPassWordInput"
                    type="password"
                    name="password"
                    invalid={formik.touched.password && Boolean(formik.errors.password)}
                    placeholder="Password"
                    aria-label="Input company password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.password && (
                    <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
                  )}
                </CCol>
              </>
            )}

            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyAddressInput">
                Salary
              </CFormLabel>
              <CFormInput
                id="addCompanySalaryInput"
                type="number"
                name="salary"
                invalid={formik.touched.salary && Boolean(formik.errors.salary)}
                placeholder="$ 0"
                aria-label="Input company salary"
                value={formik.values.salary}
                onChange={formik.handleChange}
              />
              {formik.touched.salary && (
                <CFormFeedback invalid>{formik.errors.salary}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyAddressInput">
                Firstname
              </CFormLabel>
              <CFormInput
                id="addCompanyFirstnameInput"
                type="text"
                name="firstname"
                invalid={formik.touched.firstname && Boolean(formik.errors.firstname)}
                placeholder="Firstname"
                aria-label="Input company firstname"
                value={formik.values.firstname}
                onChange={formik.handleChange}
              />
              {formik.touched.firstname && (
                <CFormFeedback invalid>{formik.errors.firstname}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyAddressInput">
                Lastname
              </CFormLabel>
              <CFormInput
                id="addCompanyLastnameInput"
                type="text"
                name="lastname"
                invalid={formik.touched.lastname && Boolean(formik.errors.lastname)}
                placeholder="Lastname"
                aria-label="Input company address"
                value={formik.values.lastname}
                onChange={formik.handleChange}
              />
              {formik.touched.lastname && (
                <CFormFeedback invalid>{formik.errors.lastname}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyAddressInput">
                Designation
              </CFormLabel>
              <CFormInput
                id="addCompanyDesignationInput"
                type="text"
                name="designation"
                invalid={formik.touched.designation && Boolean(formik.errors.designation)}
                placeholder="Designation"
                aria-label="Input company designation"
                value={formik.values.designation}
                onChange={formik.handleChange}
              />
              {formik.touched.designation && (
                <CFormFeedback invalid>{formik.errors.designation}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyPhoneInput">
                Address
              </CFormLabel>
              <CFormInput
                id="addCompanyAddressInput"
                type="text"
                name="address"
                invalid={formik.touched.address && Boolean(formik.errors.address)}
                placeholder="Address"
                aria-label="Input company address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              {formik.touched.address && (
                <CFormFeedback invalid>{formik.errors.address}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyPhoneInput">
                Phone
              </CFormLabel>
              <CFormInput
                id="addCompanyPhoneInput"
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
              <CFormLabel className="col-form-label" htmlFor="addCompanyPhoneInput">
                Country
              </CFormLabel>
              <CFormInput
                id="addCompanyCountryInput"
                type="text"
                name="country"
                invalid={formik.touched.country && Boolean(formik.errors.country)}
                placeholder="Country"
                aria-label="Input company country"
                value={formik.values.country}
                onChange={formik.handleChange}
              />
              {formik.touched.country && (
                <CFormFeedback invalid>{formik.errors.country}</CFormFeedback>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyPhoneInput">
                City
              </CFormLabel>
              <CFormInput
                id="addCompanyCityInput"
                type="text"
                name="city"
                invalid={formik.touched.city && Boolean(formik.errors.city)}
                placeholder="City"
                aria-label="Input company city"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
              {formik.touched.city && <CFormFeedback invalid>{formik.errors.city}</CFormFeedback>}
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => formik.handleSubmit()}>
            {saveButtonTitle}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const companySchema = yup.object({
  username: yup.string().required('Employee name is required'),
  password: yup.string().required('Password is required'),
  salary: yup.string().required('Salary is required'),
  firstname: yup.string().required('Firstname is required'),
  lastname: yup.string().required('Lastname name is required'),
  joindate: yup.string().required('Address is required'),
  country: yup.string().required('country name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City name is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number invalid'
    ),
})

CreateOrEditEmployeeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  company: PropTypes.any,
  saveButtonTitle: PropTypes.string,
}
