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
  CFormSelect,
} from '@coreui/react'
import { useFormik } from 'formik'
import * as yup from 'yup'

export default function CreateOrEditInsuranceAdminModal({
  visible,
  onClose,
  onCreate,
  onUpdate,
  company,
  saveButtonTitle = 'Save',
  dscty,
}) {
  const isEditing = company !== undefined
  const initialValues = {
    username: '',
    password: '',
    companyid: 0,
    role: '',
  }

  const formData = isEditing ? company : initialValues

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: formData })
    }
  }, [visible])

  const handleSubmit = (values) => {
    const { username, password, companyid, role } = values
    const payload = {
      username,
      password,
      companyid,
      role,
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
          <CModalTitle>
            {isEditing ? 'Edit insurance admin' : 'Add a new insurance admin'}
          </CModalTitle>
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
                <CCol md={6}>
                  <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                    Role
                  </CFormLabel>
                  <CFormSelect
                    name="role"
                    className="mb-3"
                    aria-label="Large select example"
                    onChange={formik.handleChange}
                  >
                    {company.role == 'IMANAGER' ? (
                      <>
                        <option value="IMANAGER">Imanager</option>
                        <option value="IFINMAN">Ifinman</option>
                      </>
                    ) : (
                      <>
                        <option value="IFINMAN">Ifinman</option>
                        <option value="IMANAGER">Imanager</option>
                      </>
                    )}
                  </CFormSelect>
                  {formik.touched.password && (
                    <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                    Company
                  </CFormLabel>
                  <CFormSelect
                    name="companyid"
                    className="mb-3"
                    aria-label="Large select example"
                    value={company.companyId}
                    onChange={formik.handleChange}
                  >
                    <option value={company.companyId}>
                      {dscty.map((i, k) => {
                        if (i.id == company.companyId) {
                          return i.name
                        }
                      })}
                    </option>

                    {dscty.map((i, k) => {
                      if (i.id != company.companyId) {
                        return (
                          <option key={k} value={i.id}>
                            {i.name}
                          </option>
                        )
                      }
                    })}
                  </CFormSelect>
                  {formik.touched.password && (
                    <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
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
                <CCol md={6}>
                  <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                    Role
                  </CFormLabel>
                  <CFormSelect
                    name="role"
                    className="mb-3"
                    aria-label="Large select example"
                    value={'IMANAGER'}
                    onChange={formik.handleChange}
                  >
                    <option value="IMANAGER">Open this select menu</option>
                    <option value="IMANAGER">Imanager</option>
                    <option value="IFINMAN">Ifinman</option>
                  </CFormSelect>
                  {formik.touched.password && (
                    <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="col-form-label" htmlFor="addCompanyNameInput">
                    Company
                  </CFormLabel>
                  <CFormSelect
                    name="companyid"
                    className="mb-3"
                    aria-label="Large select example"
                    value={1}
                    onChange={formik.handleChange}
                  >
                    {dscty.map((i, k) => (
                      <option key={k} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {formik.touched.password && (
                    <CFormFeedback invalid>{formik.errors.password}</CFormFeedback>
                  )}
                </CCol>
              </>
            )}
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
  username: yup.string().required('Insurance admin name is required'),
  password: yup.string().required('Password is required'),
})

CreateOrEditInsuranceAdminModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  company: PropTypes.any,
  dscty: PropTypes.any,

  saveButtonTitle: PropTypes.string,
}
