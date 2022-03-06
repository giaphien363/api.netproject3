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

export default function CreateOrEditCompanyModal({
  visible,
  onClose,
  onCreate,
  onUpdate,
  company,
  saveButtonTitle = 'Save',
}) {
  const isEditing = company !== undefined

  const initialValues = {
    name: '',
    address: '',
    phone: '',
    url: '',
  }

  const formData = isEditing ? company : initialValues

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: formData })
    }
  }, [visible])

  const handleSubmit = (values) => {
    const { name, address, phone, url } = values
    const payload = {
      name,
      address,
      phone,
      url,
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
          <CModalTitle>{isEditing ? 'Edit company' : 'Add a new company'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate id="addCompanyForm" className="row needs-validation">
            <CCol md={12}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                Company name
              </CFormLabel>
              <CFormInput
                id="addCompanyNameInput"
                type="text"
                name="name"
                invalid={formik.touched.name && Boolean(formik.errors.name)}
                placeholder="Name"
                aria-label="Input company name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && <CFormFeedback invalid>{formik.errors.name}</CFormFeedback>}
            </CCol>
            <CCol md={12}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyAddressInput">
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
              <CFormLabel className="col-form-label" htmlFor="addCompanyWebsiteInput">
                Website
              </CFormLabel>
              <CFormInput
                id="addCompanyWebsiteInput"
                aria-label="Company duration in days"
                type="text"
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                invalid={formik.touched.url && Boolean(formik.errors.url)}
              />
              {formik.touched.url && <CFormFeedback invalid>{formik.errors.url}</CFormFeedback>}
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
  name: yup.string().required('Company name is required'),
  address: yup.string().required('Address is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number invalid'
    ),
  url: yup
    .string()
    .required('Website is required')
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Website address invalid!'
    ),
})

CreateOrEditCompanyModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  company: PropTypes.any,
  saveButtonTitle: PropTypes.string,
}
