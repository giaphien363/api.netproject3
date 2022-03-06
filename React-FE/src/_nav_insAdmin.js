import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilDollar, cilMoney } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Insurance',
  },
  {
    component: CNavItem,
    name: 'Policies',
    to: '/insurance-policies',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Claims',
    to: '/claims',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bills',
    to: '/bills',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
]

export default _nav
