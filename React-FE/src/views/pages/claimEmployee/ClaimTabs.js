import React, { useState } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'

import Claims_InsAdmin from './Claims_InsAdmin'
import ClaimsPending_InsAdmin from './ClaimsPending_InsAdmin'

export default function ClaimTabs() {
  const [activeKey, setActiveKey] = useState(1)
  const [pendingAmount, setPendingAmount] = useState(0)

  return (
    <>
      <CNav variant="pills" role="tablist" className="mb-3">
        <CNavItem>
          <CNavLink href="#" active={activeKey === 1} onClick={() => setActiveKey(1)}>
            Pending ({pendingAmount})
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#" active={activeKey === 2} onClick={() => setActiveKey(2)}>
            All
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
          <ClaimsPending_InsAdmin setPendingAmount={setPendingAmount} />
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
          <Claims_InsAdmin />
        </CTabPane>
      </CTabContent>
    </>
  )
}
