import { CTable, CTableBody, CTableDataCell, CTableRow, CTooltip } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilDollar } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { Roles } from 'src/constants'
import { contractAPI } from 'src/apis'
import { toOldPolicyResponse } from 'src/utils'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'
import PolicyTableHeader from '../policy/components/PolicyTableHeader'
import ViewPolicyModal from '../policy/components/ViewPolicyModal'
import { savePoliciesInContract } from 'src/redux/actions/contract'
import CreateOrEditClaimModal from '../claimEmployee/components/CreateOrEditClaimModal'

const MyContract = () => {
  const params = useParams()
  const [loading, setLoading] = useState(true)

  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState()
  const [contract, setContract] = useState()

  const user = useSelector((state) => state.user)
  const policies = useSelector((state) => state.contract).policies
  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    const id = user.role === Roles.ADMIN ? params.id : user.id
    try {
      const res = await contractAPI.getByEmployeeId(id)
      const { policiesRes, contractRes } = res.data
      dispatch(savePoliciesInContract(policiesRes.map(toOldPolicyResponse)))
      setContract(contractRes)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const openDetailsModal = (item) => {
    setDetailsModalVisible(true)
    setSelectedPolicy(item)
  }

  const closeDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedPolicy()
  }

  /* START CREATE CLAIM */
  const openCreateClaimModal = (item) => {
    setCreateModalVisible(true)
    setSelectedPolicy(item)
  }

  const closeCreateClaimModal = () => {
    setCreateModalVisible(false)
    setSelectedPolicy()
  }
  /* END CREATE CLAIM */

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
      {user.role === Roles.EMPLOYEE && (
        <CTableDataCell>
          <CTooltip content="Create a new claim" placement="top">
            <CIcon
              size="xl"
              className="text-warning"
              icon={cilDollar}
              role="button"
              onClick={() => openCreateClaimModal(item)}
            />
          </CTooltip>
        </CTableDataCell>
      )}
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      {contract.name}
      {policies.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <PolicyTableHeader hasActionColumn={user.role === Roles.EMPLOYEE} />
          <CTableBody>{policies.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No policies.</div>
      )}
      <ViewPolicyModal
        visible={detailsModalVisible}
        onClose={closeDetailsModal}
        policy={selectedPolicy}
        onCreateClaim={openCreateClaimModal}
      />
      {user.role === Roles.EMPLOYEE && (
        <CreateOrEditClaimModal
          visible={createModalVisible}
          onClose={closeCreateClaimModal}
          policy={selectedPolicy}
        />
      )}
    </>
  )
}

export default MyContract
