import React, { useEffect, useState } from 'react'
import { CButton, CTable, CTableBody, CTableDataCell, CTableRow, CTooltip } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilClipboard } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'

import { PolicyStatus, Roles } from 'src/constants'
import { saveActivePolicies, savePendingPolicies } from 'src/redux/actions/policy'
import { savePoliciesInContract } from 'src/redux/actions/contract'
import { addToast } from 'src/redux/actions/toast'
import { contractAPI, policyAPI } from 'src/apis'
import CreateOrEditPolicyModal from './components/CreateOrEditPolicyModal'
import ViewPolicyModal from './components/ViewPolicyModal'
import PolicyTableHeader from './components/PolicyTableHeader'
import { Pagination } from 'src/components/misc'
import { SearchInput } from 'src/components/inputs'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'
import CreateOrEditClaimModal from '../claimEmployee/components/CreateOrEditClaimModal'
import { toOldPolicyResponse } from 'src/utils'

const Policies = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [createClaimModalVisible, setCreateModalVisible] = useState(false)
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState()

  const user = useSelector((state) => state.user)
  const policies = useSelector((state) => state.policy).active
  // for employees only
  const contractPolicies = useSelector((state) => state.contract).policies
  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await policyAPI.getAll({ status: PolicyStatus.ACTIVE, pageNumber: 1 })
      saveData(res)
      if (user.role === Roles.EMPLOYEE) {
        const resContract = await contractAPI.getByEmployeeId(user.id)
        const { policiesRes } = resContract.data
        dispatch(savePoliciesInContract(policiesRes.map(toOldPolicyResponse)))
      }
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await policyAPI.getAll({ status: PolicyStatus.ACTIVE, pageNumber: nextPage })
      saveData(res)
    } catch (error) {
      dispatch(addToast({ message: error.response.data.detail, variant: 'danger' }))
    } finally {
      setLoading(false)
    }
  }

  /* START CREATE OR EDIT */
  const openDetailsModal = (item) => {
    setDetailsModalVisible(true)
    setSelectedPolicy(item)
  }

  const closeDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedPolicy()
  }

  const createPolicy = async (payload) => {
    await policyAPI.create(payload)
    const message = `Added new policy: "${payload.name}".`
    dispatch(addToast({ message }))
    await getData()
    await getPendingPolicies()
    closeDetailsModal()
  }

  const updatePolicy = async (id, payload) => {
    await policyAPI.update(id, payload)
    const message = `Changes saved successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
  }
  /* END CREATE OR EDIT */

  /* START CREATE CLAIM */
  const openCreateClaimModal = () => {
    setDetailsModalVisible(false)
    setCreateModalVisible(true)
  }

  const closeCreateClaimModal = () => {
    setCreateModalVisible(false)
    setSelectedPolicy()
  }
  /* END CREATE CLAIM */

  const getPendingPolicies = async () => {
    const res = await policyAPI.getAll({ status: PolicyStatus.PENDING })
    const { data } = res.data
    dispatch(savePendingPolicies(data))
  }

  const saveData = (res) => {
    const { totalPages, data } = res.data
    dispatch(saveActivePolicies(data))
    setTotalPages(totalPages)
  }

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-start">
          {item.name}
          {contractPolicies.map((p) => p.id).includes(item.id) && (
            <CTooltip
              content="This policy is in your contract. You can create a claim right away."
              placement="right"
            >
              <CIcon className="mx-1" size="sm" icon={cilClipboard} />
            </CTooltip>
          )}
        </div>
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
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-between">
        {[Roles.IMANAGER, Roles.IFINMAN].includes(user.role) && (
          <CButton color="warning" onClick={() => openDetailsModal()}>
            Add Policy
          </CButton>
        )}
        <SearchInput
          searchAPI={policyAPI.getAll}
          searchParams={{ status: PolicyStatus.ACTIVE, pageNumber: 1 }}
          saveData={saveData}
          itemType="policy"
        />
      </div>
      {policies.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <PolicyTableHeader />
          <CTableBody>{policies.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No active policies.</div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      {[Roles.IMANAGER, Roles.IFINMAN].includes(user.role) ? (
        <CreateOrEditPolicyModal
          visible={detailsModalVisible}
          onClose={closeDetailsModal}
          onCreate={createPolicy}
          onUpdate={updatePolicy}
          policy={selectedPolicy}
          company={user.company}
        />
      ) : (
        <ViewPolicyModal
          visible={detailsModalVisible}
          onClose={closeDetailsModal}
          policy={selectedPolicy}
          onCreateClaim={openCreateClaimModal}
          contractPolicies={contractPolicies}
        />
      )}
      {user.role === Roles.EMPLOYEE && (
        <CreateOrEditClaimModal
          visible={createClaimModalVisible}
          onClose={closeCreateClaimModal}
          policy={selectedPolicy}
        />
      )}
    </>
  )
}

export default Policies
