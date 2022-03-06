import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CCol, CModal, CModalBody, CModalHeader, CModalTitle, CRow, CTooltip } from '@coreui/react'

import { ClaimActionStatus, ClaimStatus } from 'src/constants'
import { claimAPI } from 'src/apis'
import { calculateClaimedCost, stringUtils, toOldClaimDetailResponse } from 'src/utils'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import infoIcon from 'src/assets/images/icon-info.png'

export default function ViewClaimModal({ visible, onClose, id }) {
  const [claim, setClaim] = useState()
  const [claimActions, setClaimActions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (visible) getClaimById()
  }, [visible])

  const getClaimById = async () => {
    try {
      const res = await claimAPI.getById(id)
      const claim = toOldClaimDetailResponse(res.data)
      setClaim(claim)
      setClaimActions(claim.claimActions.reverse())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return <></>

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <CModal size="lg" alignment="center" backdrop="static" visible={visible} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>
          {claim.reason} - ${calculateClaimedCost(claim).toLocaleString()}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="mb-3">
          <CCol md={2}>
            <div className="fst-italic text-muted">Claimed cost</div>
          </CCol>
          <CCol md={10}>
            <div>
              <span className="fw-bold">${calculateClaimedCost(claim).toLocaleString()}</span> out
              of ${claim.totalCost.toLocaleString()} ({claim.policy.supportPercent}% coverage)
            </div>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={2}>
            <div className="fst-italic text-muted">Policy</div>
          </CCol>
          <CCol md={10}>
            <div>
              {claim.policy.name}
              <CTooltip content={claim.policy.description} placement="right">
                <img src={infoIcon} width="16" className="mx-2 mb-1" alt="Info icon" />
              </CTooltip>
            </div>
          </CCol>
        </CRow>
        {/* <CRow className="mb-3">
          <CCol md={2}>
            <div className="fst-italic text-muted">Provided by</div>
          </CCol>
          <CCol md={4}>
            <div>{claim.policy.company.name} days</div>
          </CCol>
          <CCol md={2}>
            <div className="fst-italic text-muted">Type</div>
          </CCol>
          <CCol md={4}>
            <div>
              {claim.policy.type.name}
              <CTooltip content={claim.policy.type.description} placement="right">
                <img src={infoIcon} width="16" className="mx-2 mb-1" alt="Info icon" />
              </CTooltip>
            </div>
          </CCol>
        </CRow> */}
        <CRow className="mb-3">
          <CCol md={2}>
            <div className="fst-italic text-muted">Reason</div>
          </CCol>
          <CCol md={10}>
            <div>{claim.reason}</div>
          </CCol>
        </CRow>
        <CRow className="mb-3 align-items-center">
          <CCol md={2}>
            <div className="fst-italic text-muted">Status</div>
          </CCol>
          <CCol md={4}>
            <div className={`custom-claim-status-${claim.status}`}>
              {ClaimStatus.mapToText(claim.status)}
            </div>
          </CCol>
          <CCol md={2}>
            <div className="fst-italic text-muted">Date created</div>
          </CCol>
          <CCol md={4}>
            <div>
              {stringUtils.getDateTimeObject(claim.createdAt).date}{' '}
              {stringUtils.getDateTimeObject(claim.createdAt).time}
            </div>
          </CCol>
        </CRow>
        <div className="fw-bold mb-3">Claim History</div>
        {claimActions.map((item, index) => (
          <div key={index}>
            <div className="d-flex justify-content-between">
              <span>
                Claim
                {[ClaimActionStatus.REJECT_BY_FIN, ClaimActionStatus.PAY].includes(
                  item.actionType
                ) && ` payment of $${calculateClaimedCost(claim).toLocaleString()}`}{' '}
                was{' '}
                <span className={`text-${ClaimActionStatus.mapToStatusColor(item.actionType)}`}>
                  {ClaimActionStatus.mapToText(item.actionType)}
                </span>{' '}
                by an {item.createbyEmployeeId ? 'employee' : 'insurance admin'}
              </span>
              <span className="text-muted">
                {stringUtils.getDateTimeObject(item.createdAt).time}{' '}
                {stringUtils.getDateTimeObject(item.createdAt).date}
              </span>
            </div>
            {/* <div>action reason: {item.reason}</div> */}
            {index !== claimActions.length - 1 && <hr />}
          </div>
        ))}
      </CModalBody>
    </CModal>
  )
}

ViewClaimModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
}
