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

import { ClaimStatus } from 'src/constants'
import { claimAPI } from 'src/apis'
import { calculateClaimedCost, toOldClaimResponse } from 'src/utils'
import { SearchInput } from 'src/components/inputs'
import { DateWithTimeTooltip, Pagination } from 'src/components/misc'
import ViewClaimModal from './components/ViewClaimModal'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'

const ClaimEmployee = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState()
  const [handleError, setHandleError] = useState('')

  useEffect(() => {
    getAllClaims()
  }, [])

  const getAllClaims = async () => {
    try {
      const res = await claimAPI.getAll({ pageNumber: 1 })
      saveData(res)
    } catch (error) {
      setHandleError(error.response.data.detail)
    } finally {
      setLoading(false)
    }
  }

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

  const openDetailsModal = (id) => {
    setDetailsModalVisible(true)
    setSelectedClaim(id)
  }

  const closeDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedClaim()
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
        id={selectedClaim}
      />
    </>
  )
}

export default ClaimEmployee
