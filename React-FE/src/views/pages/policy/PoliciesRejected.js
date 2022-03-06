import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CTable, CTableBody, CTableDataCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PolicyStatus } from 'src/constants'
import { savePendingPolicies, saveRejectedPolicies } from 'src/redux/actions/policy'
import { addToast } from 'src/redux/actions/toast'
import { policyAPI } from 'src/apis'
import { DeleteConfirmModal } from 'src/components/modals'
import { SearchInput } from 'src/components/inputs'
import CreateOrEditPolicyModal from './components/CreateOrEditPolicyModal'
import PolicyTableHeader from './components/PolicyTableHeader'
import { Pagination } from 'src/components/misc'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'

const PoliciesRejected = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState()

  const user = useSelector((state) => state.user)
  const policies = useSelector((state) => state.policy).rejected
  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await policyAPI.getAll({ status: PolicyStatus.REJECTED, pageNumber: 1 })
      saveData(res)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await policyAPI.getAll({ status: PolicyStatus.REJECTED, pageNumber: nextPage })
      saveData(res)
    } catch (error) {
      dispatch(addToast({ message: error.response.data.detail, variant: 'danger' }))
    } finally {
      setLoading(false)
    }
  }

  /* START DELETE */
  const openDeleteModal = (item) => {
    setDeleteModalVisible(true)
    setSelectedPolicy(item)
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setSelectedPolicy()
  }

  const deletePolicy = async () => {
    await policyAPI.delete(selectedPolicy.id)
    const message = `Policy "${selectedPolicy.name}" deleted successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDeleteModal()
  }
  /* END DELETE */

  /* START CREATE OR EDIT */
  const openDetailsModal = (item) => {
    setDetailsModalVisible(true)
    setSelectedPolicy(item)
  }

  const closeDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedPolicy()
  }

  const resubmitPolicy = async (id, payload) => {
    const pendingPayload = { ...payload, status: PolicyStatus.PENDING }
    await policyAPI.update(id, pendingPayload)
    const message = `Resent policy "${payload.name}" for approval.`
    dispatch(addToast({ message }))
    await getData()
    await getPendingPolicies()
    closeDetailsModal()
  }
  /* END CREATE OR EDIT */

  const getPendingPolicies = async () => {
    const res = await policyAPI.getAll({ status: PolicyStatus.PENDING })
    const { data } = res.data
    dispatch(savePendingPolicies(data))
  }

  const saveData = (res) => {
    const { totalPages, data } = res.data
    dispatch(saveRejectedPolicies(data))
    setTotalPages(totalPages)
  }

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-start">{item.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)} className="text-start">
        <div>{item.description}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{item.company.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{item.type.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{item.supportPercent}%</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{item.durationInDays} days</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>${item.price.toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell>
        <CIcon size="xl" icon={cilTrash} role="button" onClick={() => openDeleteModal(item)} />
      </CTableDataCell>
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-end">
        <SearchInput
          searchAPI={policyAPI.getAll}
          searchParams={{ status: PolicyStatus.REJECTED, pageNumber: 1 }}
          saveData={saveData}
          itemType="rejected policy"
        />
      </div>
      {policies.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <PolicyTableHeader hasActionColumn />
          <CTableBody>{policies.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No rejected policies.</div>
      )}
      {!!totalPages && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      <CreateOrEditPolicyModal
        visible={detailsModalVisible}
        onClose={closeDetailsModal}
        onUpdate={resubmitPolicy}
        policy={selectedPolicy}
        company={user.company}
        saveButtonTitle="Resend for approval"
      />
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={deletePolicy}
        itemType="policy"
        itemName={selectedPolicy && selectedPolicy.name}
      />
    </>
  )
}

export default PoliciesRejected
