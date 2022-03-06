import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { ChangePassword } from './ChangePassword'
import { ProfileModal } from './ProfileModal'
import { employeeAPI } from 'src/apis'

const AppHeaderDropdown = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const [employee, setEmployee] = useState()
  const [showModalPassword, setShowModalPassword] = useState(false)
  const [showModalProfile, setShowModalProfile] = useState(false)
  const [cookies, setCookie] = useCookies(['token'])
  const userLogin = useSelector((state) => state.user)

  const logOut = () => {
    dispatch({ type: 'LOGOUT_USER', payload: '' })
    setCookie('token', '')
    window.sessionStorage.setItem('userLogin', '')
    history.push('/login')
  }
  const showProfile = async () => {
    // call api
    try {
      const res = await employeeAPI.getEmployee(userLogin.id)
      setEmployee(res.data)
      setShowModalProfile(true)
    } catch (err) {
      console.log(err.response.data.detail)
    }
  }
  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">
            Hello, {userLogin.username}
          </CDropdownHeader>
          {userLogin.role === 'EMPLOYEE' && (
            <CDropdownItem style={{ cursor: 'pointer' }} onClick={showProfile}>
              <CIcon icon={cilUser} className="me-2" />
              Profile
            </CDropdownItem>
          )}

          <CDropdownItem
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowModalPassword(true)
            }}
          >
            <CIcon icon={cilSettings} className="me-2" />
            Change password
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={logOut} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Log out
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      <ChangePassword isShow={showModalPassword} funcShow={setShowModalPassword} />
      {employee && (
        <ProfileModal
          employee={employee}
          visible={showModalProfile}
          funcShow={setShowModalProfile}
        />
      )}
    </>
  )
}

export default AppHeaderDropdown
