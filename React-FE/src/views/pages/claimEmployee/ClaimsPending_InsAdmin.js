import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilX } from '@coreui/icons'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { ClaimStatus, Roles } from 'src/constants'
import { claimAPI } from 'src/apis'
import { addToast } from 'src/redux/actions/toast'
import { calculateClaimedCost, toOldClaimResponse } from 'src/utils'
import { SearchInput } from 'src/components/inputs'
import { DateWithTimeTooltip, Pagination } from 'src/components/misc'
import ViewClaimModal from './components/ViewClaimModal'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'

const ClaimsPending_InsAdmin = ({ setPendingAmount }) => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState()
  const [handleError, setHandleError] = useState('')

  const user = useSelector((state) => state.user)
  const PENDING =
    user.role === Roles.IMANAGER ? ClaimStatus.PENDING_APPROVAL : ClaimStatus.PENDING_PAYMENT
  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await claimAPI.getAllInsAdmin({ pageNumber: 1, status: PENDING })
      saveData(res)
    } catch (error) {
      setHandleError(error.response.data.detail)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await claimAPI.getAllInsAdmin({ pageNumber: nextPage, status: PENDING })
      saveData(res)
    } catch (error) {
      console.error(error)
      setHandleError(error.response.data.detail)
    } finally {
      setLoading(false)
    }
  }

  const saveData = (res) => {
    const { totalRecords, totalPages, data } = res.data
    setTotalPages(totalPages)
    setClaims(data.map(toOldClaimResponse))
    setPendingAmount(totalRecords)
  }

  const openDetailsModal = (id) => {
    setDetailsModalVisible(true)
    setSelectedClaim(id)
  }

  const closeDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedClaim()
  }

  const updateStatus = async (id, payload, message) => {
    await claimAPI.updateStatus(id, payload)
    dispatch(addToast({ message }))
    await getData()
  }

  const approve = (item) => {
    let newStatus, message
    if (user.role === Roles.IMANAGER) {
      newStatus = ClaimStatus.PENDING_PAYMENT
      message = `Approved claim for $${calculateClaimedCost(
        item
      )}. Claim is now sent to financial managers to process payment.`
    } else {
      newStatus = ClaimStatus.PAYMENT_APPROVED
      message = `Approved payment for $${calculateClaimedCost(item)}. A bill has been created.`
    }
    updateStatus(item.id, { status: newStatus }, message)
  }

  const reject = (item) => {
    let newStatus, message
    if (user.role === Roles.IMANAGER) {
      newStatus = ClaimStatus.REJECTED
      message = `Rejected claim for $${calculateClaimedCost(item)}.`
    } else {
      newStatus = ClaimStatus.PAYMENT_REJECTED
      message = `Rejected payment for $${calculateClaimedCost(item)}. A bill has been created.`
    }
    updateStatus(item.id, { status: newStatus }, message)
  }

  const renderRows = (item, index) => (
    <CTableRow key={index} v-for="item in tableItems">
      <CTableDataCell role="button" onClick={() => openDetailsModal(item.id)}>
        <div>{index + 1}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item.id)}>
        <div className={`custom-claim-status-${item.status}`}>
          {ClaimStatus.mapToText(item.status)}
        </div>
      </CTableDataCell>
      <CTableDataCell
        role="button"
        onClick={() => openDetailsModal(item.id)}
        className="text-start"
      >
        <div>{item.policy.name}</div>
      </CTableDataCell>
      <CTableDataCell
        role="button"
        onClick={() => openDetailsModal(item.id)}
        className="text-start"
      >
        <div>{item.reason}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item.id)}>
        <div>${item.totalCost.toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item.id)} className="fw-bold">
        <div>${calculateClaimedCost(item).toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item.id)}>
        <DateWithTimeTooltip dateString={item.createdAt} />
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item.id)}>
        <DateWithTimeTooltip dateString={item.updatedAt} />
      </CTableDataCell>
      <CTableDataCell>
        {item.status === ClaimStatus.PENDING_APPROVAL && user.role === Roles.IMANAGER && (
          <>
            <CIcon
              size="xl"
              className="text-success"
              icon={cilCheckAlt}
              role="button"
              onClick={() => approve(item)}
            />
            <CIcon
              size="xl"
              className="text-danger"
              icon={cilX}
              role="button"
              onClick={() => reject(item)}
            />
          </>
        )}
        {item.status === ClaimStatus.PENDING_PAYMENT && user.role === Roles.IFINMAN && (
          <>
            <CIcon
              size="xl"
              className="text-success"
              icon={cilCheckAlt}
              role="button"
              onClick={() => approve(item)}
            />
            <CIcon
              size="xl"
              className="text-danger"
              icon={cilX}
              role="button"
              onClick={() => reject(item)}
            />
          </>
        )}
      </CTableDataCell>
    </CTableRow>
  )

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-end">
        <SearchInput
          searchAPI={claimAPI.getAllInsAdmin}
          searchParams={{ pageNumber: 1, status: PENDING }}
          saveData={saveData}
          itemType="pending claim"
        />
      </div>
      <CustomLoaderSpinner loading={loading} />
      {handleError && <CAlert color="danger">{handleError}</CAlert>}
      {claims.length > 0 && (
        <div>
          <CTable color="light" align="middle" className="border text-center" hover responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Policy</CTableHeaderCell>
                <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total cost</CTableHeaderCell>
                <CTableHeaderCell scope="col">Claimed cost</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date created</CTableHeaderCell>
                <CTableHeaderCell scope="col">Last modified</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>{claims.map(renderRows)}</CTableBody>
          </CTable>
        </div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      <ViewClaimModal
        visible={detailsModalVisible}
        onClose={closeDetailsModal}
        id={selectedClaim}
      />
    </>
  )
}

ClaimsPending_InsAdmin.propTypes = {
  setPendingAmount: PropTypes.func.isRequired,
}

export default ClaimsPending_InsAdmin
