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

export default function ModalTypePolicy({ visible, onClose, onCreate, onUpdate, item }) {
  const isEditing = item !== undefined

  const initialValues = {
    name: '',
    description: '',
  }

  const formData = isEditing ? { name: item.name, description: item.description } : initialValues

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: formData })
    }
  }, [visible])

  const handleSubmit = (values) => {
    const { name, description } = values
    const payload = {
      name,
      description,
    }
    if (isEditing) onUpdate(item.id, payload)
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
          <CModalTitle>{isEditing ? 'Edit Type' : 'Add a new type'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate id="addCompanyForm" className="row needs-validation">
            <CCol md={12}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                Policy type
              </CFormLabel>
              <CFormInput
                id="addCompanyNameInput"
                type="text"
                name="name"
                invalid={formik.touched.name && Boolean(formik.errors.name)}
                placeholder="Name"
                aria-label="Input type name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && <CFormFeedback invalid>{formik.errors.name}</CFormFeedback>}
            </CCol>
            <CCol md={12}>
              <CFormLabel className="col-form-label" htmlFor="addCompanyAddressInput">
                Description
              </CFormLabel>
              <CFormInput
                id="addCompanyAddressInput"
                type="text"
                name="description"
                invalid={formik.touched.description && Boolean(formik.errors.description)}
                placeholder="description"
                aria-label="Input description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
              {formik.touched.description && (
                <CFormFeedback invalid>{formik.errors.description}</CFormFeedback>
              )}
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => formik.handleSubmit()}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const companySchema = yup.object({
  name: yup.string().required('Company name is required'),
  description: yup.string().required('Address is required'),
})

ModalTypePolicy.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  item: PropTypes.any,
}
