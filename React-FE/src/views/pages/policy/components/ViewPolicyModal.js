import React from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CProgress,
  CProgressBar,
  CRow,
  CTooltip,
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'

import { Roles } from 'src/constants'
import { orderAPI } from 'src/apis'
import { addToast } from 'src/redux/actions/toast'
import infoIcon from 'src/assets/images/icon-info.png'

export default function ViewPolicyModal({
  visible,
  onClose,
  policy = { type: {} },
  contractPolicies,
  onCreateClaim,
}) {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const typeExistsInContract =
    contractPolicies && !!contractPolicies.find((p) => p.type.id === policy.type.id)

  const orderPolicy = async () => {
    const payload = {
      employeeId: user.id,
      policyId: policy.id,
    }
    await orderAPI.create(payload)
    const message = `Sent a request to add policy "${policy.name} to your contract. Please wait for the request to be processed."`
    dispatch(addToast({ message }))
    onClose()
  }

  /* eslint react/prop-types: 0 */
  const OrderPolicyButtonWrapper = (props) => {
    if (typeExistsInContract)
      return (
        <CTooltip content="You already have a policy of type in your contract." placement="top">
          <div>
            {/* add wrapper div because tooltip doesnt work around disabled btn */}
            {props.children}
          </div>
        </CTooltip>
      )

    return <>{props.children}</>
  }

  if (!visible) return <></>

  return (
    <CModal size="lg" alignment="center" backdrop="static" visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>{policy.name}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-3">
          <CCol md={2}>
            <div className="fst-italic text-muted">Policy name</div>
          </CCol>
          <CCol md={4}>
            <div className="fw-bold">{policy.name}</div>
          </CCol>
          <CCol md={2}>
            <div className="fst-italic text-muted">Company</div>
          </CCol>
          <CCol md={4}>
            <div>{policy.company.name}</div>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={2}>
            <div className="fst-italic text-muted">Description</div>
          </CCol>
          <CCol md={10}>
            <div>{policy.description}</div>
          </CCol>
        </CRow>
        <CRow className="mb-3 align-items-center">
          <CCol md={2}>
            <div className="fst-italic text-muted">Type</div>
          </CCol>
          <CCol md={4}>
            <div>
              {policy.type.name}
              <CTooltip content={policy.type.description} placement="right">
                <img src={infoIcon} width="16" className="mx-2 mb-1" alt="Info icon" />
              </CTooltip>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="fst-italic text-muted">Coverage</div>
          </CCol>
          <CCol md={4}>
            <CProgress>
              <CProgressBar value={policy.supportPercent} color="info">
                {policy.supportPercent}%
              </CProgressBar>
            </CProgress>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={2}>
            <div className="fst-italic text-muted">Duration</div>
          </CCol>
          <CCol md={4}>
            <div>{policy.durationInDays} days</div>
          </CCol>
          <CCol md={2}>
            <div className="fst-italic text-muted">Price</div>
          </CCol>
          <CCol md={4}>
            <div>${policy.price.toLocaleString()}</div>
          </CCol>
        </CRow>
      </CModalBody>
      {user.role === Roles.EMPLOYEE && (
        <CModalFooter>
          {/* contractPolicies !== null ---> in policy page */}
          {contractPolicies ? (
            contractPolicies.map((p) => p.id).includes(policy.id) ? (
              <>
                <div className="fst-italic">This policy is in your contract.</div>
                <CButton color="primary" onClick={onCreateClaim}>
                  Create a claim
                </CButton>
              </>
            ) : (
              <>
                <div className="fst-italic">This policy is not in your contract.</div>
                <OrderPolicyButtonWrapper>
                  <CButton color="primary" onClick={orderPolicy} disabled={typeExistsInContract}>
                    Add to my contract
                  </CButton>
                </OrderPolicyButtonWrapper>
              </>
            )
          ) : (
            <CButton color="primary" onClick={onCreateClaim}>
              {/* contractPolicies === null ---> in contract page */}
              Create a claim
            </CButton>
          )}
        </CModalFooter>
      )}
    </CModal>
  )
}

ViewPolicyModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  policy: PropTypes.any.isRequired,
  contractPolicies: PropTypes.array,
  onCreateClaim: PropTypes.func,
}
