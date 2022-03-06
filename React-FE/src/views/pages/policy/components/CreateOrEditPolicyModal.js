import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'

export default function CreateOrEditPolicyModal({
  visible,
  onClose,
  onCreate,
  onUpdate,
  policy,
  company,
  saveButtonTitle = 'Save',
}) {
  const policyTypes = useSelector((state) => state.policyType).list

  const isEditing = policy !== undefined

  const initialValues = {
    name: '',
    description: '',
    typeId: '',
    supportPercent: '',
    durationInDays: '',
    price: '',
  }

  const formData = isEditing ? policy : initialValues

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: formData })
    }
  }, [visible])

  const handleSubmit = (values) => {
    const { name, description, supportPercent, durationInDays, price, typeId } = values
    const payload = {
      name,
      description,
      supportPercent,
      durationInDays,
      price,
      typeId: +typeId,
      companyId: company.id,
    }
    if (isEditing) onUpdate(policy.id, payload)
    else onCreate(payload)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: policySchema,
    onSubmit: handleSubmit,
  })

  return (
    <>
      <CModal size="lg" alignment="center" backdrop="static" visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>{isEditing ? 'Edit policy' : 'Add a new policy'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate id="addPolicyForm" className="row needs-validation">
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addPolicyNameInput">
                Policy name
              </CFormLabel>
              <CFormInput
                id="addPolicyNameInput"
                type="text"
                name="name"
                invalid={formik.touched.name && Boolean(formik.errors.name)}
                placeholder="Concise and clear!"
                aria-label="Input policy name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && <CFormFeedback invalid>{formik.errors.name}</CFormFeedback>}
            </CCol>
            <CCol md={6}>
              <CFormLabel className="col-form-label" htmlFor="addPolicyCompanySelect">
                Company
              </CFormLabel>
              <CFormSelect
                id="addPolicyCompanySelect"
                aria-label="Select an insurance company"
                options={[{ value: company.id, label: company.name }]}
                defaultValue={company.id}
                disabled
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel className="col-form-label" htmlFor="addPolicyDescriptionTextArea">
                Description
              </CFormLabel>
              <CFormTextarea
                id="addPolicyDescriptionTextArea"
                rows="5"
                maxLength="1000"
                name="description"
                placeholder="What does this policy cover?"
                value={formik.values.description}
                onChange={formik.handleChange}
                invalid={formik.touched.description && Boolean(formik.errors.description)}
              />
              {formik.touched.description && (
                <CFormFeedback invalid>{formik.errors.description}</CFormFeedback>
              )}
            </CCol>
            <CCol md={3}>
              <CFormLabel className="col-form-label" htmlFor="addPolicyTypeSelect">
                Type
              </CFormLabel>
              <CFormSelect
                id="addPolicyTypeSelect"
                aria-label="Select a policy type"
                name="typeId"
                value={formik.values.typeId}
                onChange={formik.handleChange}
                invalid={formik.touched.typeId && Boolean(formik.errors.typeId)}
              >
                <option hidden>Select a type</option>
                {policyTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </CFormSelect>
              {formik.touched.typeId && (
                <CFormFeedback invalid>{formik.errors.typeId}</CFormFeedback>
              )}
            </CCol>
            <CCol md={3}>
              <CFormLabel className="col-form-label" htmlFor="addPolicyCoverageInput">
                Coverage
              </CFormLabel>
              <CInputGroup className="has-validation mb-3">
                <CInputGroupText>%</CInputGroupText>
                <CFormInput
                  id="addPolicyCoverageInput"
                  aria-label="Coverage percentage"
                  type="number"
                  name="supportPercent"
                  value={formik.values.supportPercent}
                  onChange={formik.handleChange}
                  invalid={formik.touched.supportPercent && Boolean(formik.errors.supportPercent)}
                />
                {formik.touched.supportPercent && (
                  <CFormFeedback invalid>{formik.errors.supportPercent}</CFormFeedback>
                )}
              </CInputGroup>
            </CCol>
            <CCol md={3}>
              <CFormLabel className="col-form-label" htmlFor="addPolicyDurationInput">
                Duration (days)
              </CFormLabel>
              <CFormInput
                id="addPolicyDurationInput"
                aria-label="Policy duration in days"
                type="number"
                name="durationInDays"
                value={formik.values.durationInDays}
                onChange={formik.handleChange}
                invalid={formik.touched.durationInDays && Boolean(formik.errors.durationInDays)}
              />
              {formik.touched.durationInDays && (
                <CFormFeedback invalid>{formik.errors.durationInDays}</CFormFeedback>
              )}
            </CCol>
            <CCol md={3}>
              <CFormLabel className="col-form-label" htmlFor="addPolicyPriceInput">
                Price
              </CFormLabel>
              <CInputGroup className="has-validation mb-3">
                <CInputGroupText>$</CInputGroupText>
                <CFormInput
                  id="addPolicyPriceInput"
                  aria-label="Amount (to the nearest dollar)"
                  type="number"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  invalid={formik.touched.price && Boolean(formik.errors.price)}
                />
                {formik.touched.price && (
                  <CFormFeedback invalid>{formik.errors.price}</CFormFeedback>
                )}
              </CInputGroup>
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

const policySchema = yup.object({
  name: yup.string().required('Policy name is required'),
  description: yup.string(),
  typeId: yup.number().required('Type is required'),
  supportPercent: yup
    .number()
    .required('Coverage is required')
    .typeError('Coverage must be a number')
    .min(1, 'Coverage must be at least 1')
    .max(100, 'Coverage cannot be more than 100'),
  durationInDays: yup
    .number()
    .required('Duration is required')
    .typeError('Duration must be a number')
    .integer('Duration should be an integer')
    .min(1, 'Duration must be at least 1'),
  price: yup
    .number()
    .required('Price is required')
    .typeError('Price must be a number')
    .min(0, 'Price must be at least 0'),
})

CreateOrEditPolicyModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  policy: PropTypes.any,
  company: PropTypes.any,
  saveButtonTitle: PropTypes.string,
}
