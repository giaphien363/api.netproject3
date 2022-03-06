import React from 'react'

const BillAdmin = React.lazy(() => import('./views/pages/bill/BillAdmin'))
const Report = React.lazy(() => import('./views/dashboard/Report'))
const Contracts = React.lazy(() => import('./views/pages/contract/Contracts'))
const MyContract = React.lazy(() => import('./views/pages/contract/MyContract'))
const PolicyTabs = React.lazy(() => import('./views/pages/policy/PolicyTabs'))
const Claims_Admin = React.lazy(() => import('./views/pages/claimEmployee/Claims_Admin'))
const Employee = React.lazy(() => import('./views/pages/employee/Employee'))
const InsuranceAdmin = React.lazy(() => import('./views/pages/insuranceAdmin/InsuranceAdmin'))
const InsuranceCompanies = React.lazy(() =>
  import('./views/pages/insuranceCompany/InsuranceCompanies')
)

const OrderAdmin = React.lazy(() => import('./views/pages/policyOrder/OrderAdmin'))
const TypePolicy = React.lazy(() => import('./views/pages/typePolicy/TypePolicy'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/reports', name: 'Report', component: Report },
  { path: '/employee', name: 'Employess', component: Employee },
  {
    path: '/insurance-policies',
    name: 'Insurance Policies',
    exact: true,
    component: PolicyTabs,
  },
  {
    path: '/contracts',
    name: 'Contracts',
    exact: true,
    component: Contracts,
  },
  { path: '/contracts/:id', name: 'Contract Details', component: MyContract },
  { path: '/claims', name: 'Claims', exact: true, component: Claims_Admin },
  { path: '/bills', name: 'Bills', exact: true, component: BillAdmin },
  {
    path: '/insurance-companies',
    name: 'Insurance Companies',
    exact: true,
    component: InsuranceCompanies,
  },
  {
    path: '/insurance-admin',
    name: 'Insurance Admin',
    exact: true,
    component: InsuranceAdmin,
  },
  { path: '/orders', name: 'Orders', exact: true, component: OrderAdmin },
  { path: '/type-policy', name: 'Type Policy', exact: true, component: TypePolicy },
]

export default routes
