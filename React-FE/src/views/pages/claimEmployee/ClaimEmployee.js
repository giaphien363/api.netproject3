import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
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
import { useDispatch } from 'react-redux'

import { addToast } from 'src/redux/actions/toast'
import { ClaimStatus } from 'src/constants'
import { claimAPI } from 'src/apis'
import { calculateClaimedCost, toOldClaimResponse } from 'src/utils'
import { SearchInput } from 'src/components/inputs'
import { DateWithTimeTooltip, Pagination } from 'src/components/misc'
import ViewClaimModal from './components/ViewClaimModal'
import CreateOrEditClaimModal from './components/CreateOrEditClaimModal'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'
import { DeleteConfirmModal } from 'src/components/modals'

const ClaimEmployee = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState()
  const [handleError, setHandleError] = useState('')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const dispatch = useDispatch()
  useEffect(() => {
    getAllClaims(() => setLoading(false))
  }, [])

  const getAllClaims = async (onFinish) => {
    try {
      const res = await claimAPI.getAll({ pageNumber: 1 })
      saveData(res)
    } catch (error) {
      setHandleError(error.response.data.detail)
    } finally {
      if (onFinish) onFinish()
    }
  }

  /* START DELETE */
  const openDeleteModal = (item) => {
    setDeleteModalVisible(true)
    setSelectedClaim(item)
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setSelectedClaim()
  }

  const deleteClaim = async () => {
    await claimAPI.delete(selectedClaim.id)
    const message = `Claim "${selectedClaim.policy}" deleted successfully.`
    dispatch(addToast({ message }))
    await getAllClaims()
    closeDeleteModal()
  }
  /* END DELETE */

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await claimAPI.getAll({ pageNumber: nextPage })
      saveData(res)
    } catch (error) {
      setHandleError(error.response.data.detail)
    } finally {
      setLoading(false)
    }
  }

  const saveData = (res) => {
    const { totalPages, data } = res.data
    setTotalPages(totalPages)
    setClaims(data.map(toOldClaimResponse))
  }

  const openModal = (item) => {
    if (item.status === ClaimStatus.PENDING_APPROVAL) openEditModal(item)
    else openDetailsModal(item)
  }

  const openDetailsModal = (item) => {
    setDetailsModalVisible(true)
    setSelectedClaim(item)
  }

  const closeDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedClaim()
  }

  const openEditModal = (item) => {
    setEditModalVisible(true)
    setSelectedClaim(item)
  }

  const closeEditModal = () => {
    setEditModalVisible(false)
    setSelectedClaim()
  }

  const renderRows = (item, index) => (
    <CTableRow key={index} v-for="item in tableItems">
      <CTableDataCell role="button" onClick={() => openModal(item)}>
        <div>{index + 1}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openModal(item)}>
        <div className={`custom-claim-status-${item.status}`}>
          {ClaimStatus.mapToText(item.status)}
        </div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openModal(item)} className="text-start">
        <div>{item.policy.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openModal(item)} className="text-start">
        <div>{item.reason}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openModal(item)}>
        <div>${item.totalCost.toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openModal(item)} className="fw-bold">
        <div>${calculateClaimedCost(item).toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openModal(item)}>
        <DateWithTimeTooltip dateString={item.createdAt} />
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openModal(item)}>
        <DateWithTimeTooltip dateString={item.updatedAt} />
      </CTableDataCell>
      <CTableDataCell>
        {[
          ClaimStatus.PENDING_APPROVAL,
          ClaimStatus.REJECTED,
          ClaimStatus.PAYMENT_REJECTED,
        ].includes(item.status) && (
          <CIcon size="xl" icon={cilTrash} role="button" onClick={() => openDeleteModal(item)} />
        )}
      </CTableDataCell>
    </CTableRow>
  )

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-end">
        <SearchInput
          searchAPI={claimAPI.getAll}
          searchParams={{ pageNumber: 1 }}
          saveData={saveData}
          itemType="claim"
        />
      </div>
      <CustomLoaderSpinner loading={loading} />
      {handleError && <CAlert color="danger">{handleError}</CAlert>}
      {claims.length > 0 ? (
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
      ) : (
        <div>No claims.</div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      <ViewClaimModal
        visible={detailsModalVisible}
        onClose={closeDetailsModal}
        id={selectedClaim && selectedClaim.id}
      />
      <CreateOrEditClaimModal
        visible={editModalVisible}
        onClose={closeEditModal}
        claim={selectedClaim}
        refreshData={getAllClaims}
        policy={selectedClaim && selectedClaim.policy}
      />
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={deleteClaim}
        itemType="claim"
        itemName={selectedClaim && selectedClaim.policy}
      />
    </>
  )
}

export default ClaimEmployee
