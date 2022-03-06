import React from 'react'

// Policies
const PolicyTabs = React.lazy(() => import('./views/pages/policy/PolicyTabs'))

// Claim Employee
const ClaimsTabs = React.lazy(() => import('./views/pages/claimEmployee/ClaimTabs'))

// Bill for insurance
const Bills = React.lazy(() => import('./views/pages/bill/Bill_Insu'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/insurance-policies',
    name: 'Insurance Policies',
    exact: true,
    component: PolicyTabs,
  },
  { path: '/claims', name: 'Claims', exact: true, component: ClaimsTabs },
  { path: '/bills', name: 'Bills', exact: true, component: Bills },
]

export default routes
