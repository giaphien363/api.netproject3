import React, { useState, useEffect } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'

import Policies from './Policies'
import PoliciesPending from './PoliciesPending'
import PoliciesRejected from './PoliciesRejected'
import { PolicyStatus, Roles } from 'src/constants'
import { insuranceAdminAPI, policyTypeAPI } from 'src/apis'
import { saveAllPolicyTypes } from 'src/redux/actions/policyType'
import { saveInsAdminCompany } from 'src/redux/actions/userLogin'
import { SearchInput } from 'src/components/inputs'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'

export default function PolicyTabs() {
  const [activeKey, setActiveKey] = useState(1)
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.user)
  const { pending } = useSelector((state) => state.policy)

  const dispatch = useDispatch()

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      await getPolicyTypes()
      if ([Roles.IMANAGER, Roles.IFINMAN].includes(user.role) && !user.company)
        await getCompanyData(user.id)
    } finally {
      setLoading(false)
    }
  }

  const getPolicyTypes = async () => {
    const { data } = await policyTypeAPI.getAll()
    console.log(data)
    dispatch(saveAllPolicyTypes(data))
  }

  const getCompanyData = async (userId) => {
    const { data } = await insuranceAdminAPI.getById(userId)
    dispatch(saveInsAdminCompany(data))
  }

  if (loading) return <CustomLoaderSpinner loading={loading} />

  if (user.role === Roles.EMPLOYEE) return <Policies status={PolicyStatus.ACTIVE} />

  return (
    <>
      <CNav variant="pills" role="tablist" className="mb-3">
        <CNavItem>
          <CNavLink href="#" active={activeKey === 1} onClick={() => setActiveKey(1)}>
            Active
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#" active={activeKey === 2} onClick={() => setActiveKey(2)}>
            Pending ({pending.length})
          </CNavLink>
        </CNavItem>
        {[Roles.IMANAGER, Roles.IFINMAN].includes(user.role) && (
          <CNavItem>
            <CNavLink href="#" active={activeKey === 3} onClick={() => setActiveKey(3)}>
              Rejected
            </CNavLink>
          </CNavItem>
        )}
      </CNav>
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
          <Policies />
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
          <PoliciesPending />
        </CTabPane>
        {[Roles.IMANAGER, Roles.IFINMAN].includes(user.role) && (
          <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
            <PoliciesRejected />
          </CTabPane>
        )}
      </CTabContent>
    </>
  )
}
