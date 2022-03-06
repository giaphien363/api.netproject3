import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CRow,
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
  CTooltip,
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { calculateClaimedCost } from 'src/utils'
import { claimAPI } from 'src/apis'
import { addToast } from 'src/redux/actions/toast'
import infoIcon from 'src/assets/images/icon-info.png'

export default function CreateOrEditClaimModal({
  visible,
  onClose,
  claim,
  saveButtonTitle = 'Save',
  policy = { type: {}, company: {} },
  refreshData,
}) {
  const [selectedPolicy, setSelectedPolicy] = useState(policy)
  const myPolicies = useSelector((state) => state.contract).policies
  const user = useSelector((state) => state.user)

  const isEditing = claim !== undefined

  const dispatch = useDispatch()
  const history = useHistory()

  const initialValues = {
    reason: '',
    policyId: policy.id,
    totalCost: '',
  }

  const formData = isEditing ? claim : initialValues

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: formData })
      // if (isEditing) setSelectedPolicy(claim.policy)
      // else setSelectedPolicy(myPolicies.find((p) => p.id === +policy.id))
      setSelectedPolicy(myPolicies.find((p) => p.id === +policy.id))
    }
  }, [visible])

  const handleSubmit = (values) => {
    const { reason, totalCost, policyId } = values
    const payload = {
      reason,
      totalCost,
      policyId: +policyId,
      employeeId: user.id,
    }
    if (isEditing) updateClaim(payload)
    else createClaim(payload)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: claimSchema,
    onSubmit: handleSubmit,
  })

  const handleChangePolicy = (event) => {
    const selectedId = event.target.value
    setSelectedPolicy(myPolicies.find((p) => p.id === +selectedId))
    formik.handleChange(event)
  }

  const createClaim = async (payload) => {
    await claimAPI.create(payload)
    const message = `Added new claim for $${calculateClaimedCost({
      policy: selectedPolicy,
      totalCost: formik.values.totalCost,
    })}.`
    dispatch(addToast({ message }))
    history.push('/claims')
  }

  const updateClaim = async (payload) => {
    await claimAPI.update(claim.id, payload)
    const message = `Updated claim for $${calculateClaimedCost({
      policy: selectedPolicy,
      totalCost: formik.values.totalCost,
    })}.`
    dispatch(addToast({ message }))
    refreshData()
    onClose()
  }

  return (
    <>
      <CModal size="lg" alignment="center" backdrop="static" visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>{isEditing ? 'Edit claim' : 'Create a new claim'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate id="addPolicyForm" className="needs-validation">
            <CRow className="mb-3 align-items-center">
              <CCol md={2}>
                <CFormLabel className="col-form-label fst-italic" htmlFor="addPolicyTypeSelect">
                  Policy
                </CFormLabel>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  id="addPolicyTypeSelect"
                  aria-label="Select a claim type"
                  name="policyId"
                  value={formik.values.policyId}
                  onChange={handleChangePolicy}
                  invalid={formik.touched.policyId && Boolean(formik.errors.policyId)}
                >
                  <option hidden>Select a policy</option>
                  {myPolicies.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </CFormSelect>
                {formik.touched.policyId && (
                  <CFormFeedback invalid>{formik.errors.policyId}</CFormFeedback>
                )}
              </CCol>
              <CCol md={2}>
                <div className="fst-italic">Type</div>
              </CCol>
              <CCol md={4}>
                <div>
                  {selectedPolicy.type.name}
                  <CTooltip content={selectedPolicy.type.description} placement="right">
                    <img src={infoIcon} width="16" className="mx-2 mb-1" alt="Info icon" />
                  </CTooltip>
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={2}>
                <div className="fst-italic">Description</div>
              </CCol>
              <CCol md={10}>
                <div>{selectedPolicy.description}</div>
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={3} className="text-center justify-content-centers">
                <CFormLabel className="col-form-label fst-italic" htmlFor="totalCostInput">
                  Total cost
                </CFormLabel>
                <CInputGroup className="has-validation w-50 mx-auto">
                  <CInputGroupText className="rounded-left" style={{ padding: '0.125rem 0.25rem' }}>
                    $
                  </CInputGroupText>
                  <CFormInput
                    id="totalCostInput"
                    style={{ padding: '0.125rem 0.25rem' }}
                    aria-label="Total cost"
                    type="number"
                    min="0"
                    name="totalCost"
                    value={formik.values.totalCost}
                    onChange={formik.handleChange}
                    invalid={formik.touched.totalCost && Boolean(formik.errors.totalCost)}
                  />
                  {formik.touched.totalCost && (
                    <CFormFeedback invalid>{formik.errors.totalCost}</CFormFeedback>
                  )}
                </CInputGroup>
              </CCol>
              <CCol md={1} className="text-center">
                <div>✕</div>
              </CCol>
              <CCol md={3} className="text-center">
                <div className="col-form-label fst-italic">Policy coverage</div>
                <div style={{ padding: '0.125rem 0.75rem' }}>{selectedPolicy.supportPercent}%</div>
              </CCol>
              <CCol md={1} className="text-center">
                <div style={{ fontSize: '1.5rem' }}>=</div>
              </CCol>
              <CCol md={3} className="text-center">
                <div className="col-form-label fst-italic">Claimed cost</div>
                <div className="fw-bold" style={{ padding: '0.125rem 0.75rem' }}>
                  $
                  {calculateClaimedCost({
                    policy: selectedPolicy,
                    totalCost: formik.values.totalCost || 0,
                  })}
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel className="col-form-label fst-italic" htmlFor="addClaimReasonTextArea">
                  Reason
                </CFormLabel>
                <CFormTextarea
                  id="addClaimReasonTextArea"
                  rows="5"
                  maxLength="1000"
                  name="reason"
                  placeholder="Why are you creating this claim?"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  invalid={formik.touched.reason && Boolean(formik.errors.reason)}
                />
                {formik.touched.reason && (
                  <CFormFeedback invalid>{formik.errors.reason}</CFormFeedback>
                )}
              </CCol>
            </CRow>
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

const claimSchema = yup.object({
  reason: yup.string(),
  policyId: yup.number().required('Select a policy'),
  totalCost: yup
    .number()
    .required('Total cost is required')
    .typeError('Total cost must be a number')
    .min(0, 'Total cost must be at least 0'),
})

CreateOrEditClaimModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
  claim: PropTypes.any,
  saveButtonTitle: PropTypes.string,
  policy: PropTypes.any,
}
