import { CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PolicyStatus, Roles } from 'src/constants'
import { savePendingPolicies } from 'src/redux/actions/policy'
import { addToast } from 'src/redux/actions/toast'
import { policyAPI } from 'src/apis'
import { DeleteConfirmModal } from 'src/components/modals'
import { SearchInput } from 'src/components/inputs'
import CreateOrEditPolicyModal from './components/CreateOrEditPolicyModal'
import ViewPolicyModal from './components/ViewPolicyModal'
import PendingPoliciesTableRow from './components/PendingPoliciesTableRow'
import PolicyTableHeader from './components/PolicyTableHeader'
import { Pagination } from 'src/components/misc'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'

const PoliciesPending = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState()

  const user = useSelector((state) => state.user)
  const policies = useSelector((state) => state.policy).pending
  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await policyAPI.getAll({ status: PolicyStatus.PENDING, pageNumber: 1 })
      saveData(res)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await policyAPI.getAll({ status: PolicyStatus.PENDING, pageNumber: nextPage })
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

  const updatePolicy = async (id, payload) => {
    await policyAPI.update(id, payload)
    const message = `Changes saved successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
  }
  /* END CREATE OR EDIT */

  const saveData = (res) => {
    const { totalPages, data } = res.data
    dispatch(savePendingPolicies(data))
    setTotalPages(totalPages)
  }

  const renderPendingRows = (item, index) => (
    <PendingPoliciesTableRow
      key={index}
      policy={item}
      onViewDetails={openDetailsModal}
      onDelete={openDeleteModal}
    />
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-end">
        <SearchInput
          searchAPI={policyAPI.getAll}
          searchParams={{ status: PolicyStatus.PENDING, pageNumber: 1 }}
          saveData={saveData}
          itemType="pending policy"
        />
      </div>
      {policies.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <PolicyTableHeader hasActionColumn />
          <CTableBody>{policies.map(renderPendingRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No pending policies.</div>
      )}
      {!!totalPages && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      {[Roles.IMANAGER, Roles.IFINMAN].includes(user.role) ? (
        <CreateOrEditPolicyModal
          visible={detailsModalVisible}
          onClose={closeDetailsModal}
          onUpdate={updatePolicy}
          policy={selectedPolicy}
          company={user.company}
        />
      ) : (
        <ViewPolicyModal
          visible={detailsModalVisible}
          onClose={closeDetailsModal}
          policy={selectedPolicy}
        />
      )}
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

export default PoliciesPending
