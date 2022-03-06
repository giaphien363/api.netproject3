import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logoNegative from 'src/assets/brand/logo-negative.png'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import adminNavigation from '../_nav_admin'
import employeeNavigation from '../_nav_employee'
import insAdminNavigation from '../_nav_insAdmin'
import { Roles } from 'src/constants'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AppSidebar = () => {
  const history = useHistory()
  const [cookies, setCookie] = useCookies(['token'])
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const user = useSelector((state) => state.user)

  const [navigation, setNavigation] = useState()

  useEffect(() => {
    if (user.role === '') {
      dispatch({ type: 'LOGOUT_USER', payload: '' })
      setCookie('token', '')
      window.sessionStorage.setItem('userLogin', '')
      history.push('/login')
    }
    switch (user.role) {
      case Roles.ADMIN:
        setNavigation(adminNavigation)
        break
      case Roles.EMPLOYEE:
        setNavigation(employeeNavigation)
        break
      default:
        setNavigation(insAdminNavigation)
        break
    }
  }, [])

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img className="sidebar-brand-full" src={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>{navigation && <AppSidebarNav items={navigation} />}</SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      /> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
