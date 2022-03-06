import React from 'react'

// Contract
const MyContract = React.lazy(() => import('./views/pages/contract/MyContract'))

// Policies
const PolicyTabs = React.lazy(() => import('./views/pages/policy/PolicyTabs'))
const InsuranceCompanies = React.lazy(() =>
  import('./views/pages/insuranceCompany/CompaniesEmployee')
)

// Claim Employee
const ClaimEmployee = React.lazy(() => import('./views/pages/claimEmployee/ClaimEmployee'))
const BillEmp = React.lazy(() => import('./views/pages/bill/BillEmp'))

// order
const OrderEmployee = React.lazy(() => import('./views/pages/policyOrder/OrderEmployee'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/my-contract', name: 'My Contract', component: MyContract },
  {
    path: '/insurance-policies',
    name: 'Insurance Policies',
    exact: true,
    component: PolicyTabs,
  },
  {
    path: '/insurance-companies',
    name: 'Insurance Companies',
    exact: true,
    component: InsuranceCompanies,
  },
  { path: '/claims', name: 'Claims', exact: true, component: ClaimEmployee },
  { path: '/bills', name: 'Bills', exact: true, component: BillEmp },
  { path: '/orders', name: 'Orders', exact: true, component: OrderEmployee },
]

export default routes
