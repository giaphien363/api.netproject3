import React, { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'

import { authAPI } from 'src/apis'
import CustomLoaderSpinner from '../../../components/CustomLoaderSpinner'
import Health_img from 'src/assets/images/health-image.jpeg'

const Login = ({ type }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [cookies, setCookie] = useCookies(['token'])
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let userLogin = window.sessionStorage.getItem('userLogin') || ''
    userLogin = userLogin ? JSON.parse(userLogin) : ''
    if (cookies.token && userLogin.username) {
      history.push('/')
    } else {
      setCookie('token', null)
      dispatch({ type: 'LOGOUT_USER' })
      window.sessionStorage.setItem('userLogin', '')
    }
  }, [])

  const changeValue = (e) => {
    const name = e.target.name
    const value = e.target.value
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.username.length <= 3 || form.password.length <= 3) {
      setError('Fill out the field!')
      return
    }
    setLoading(true)
    try {
      const loginRes = await authAPI.login(type, form)
      setCookie('token', loginRes.data.access)

      const res = await authAPI.getUserAuthInfo()
      dispatch({ type: 'ADD_USER', payload: res.data })
      window.sessionStorage.setItem('userLogin', JSON.stringify(res.data))
      history.push('/')
    } catch (err) {
      setError(err.response.data.detail)
      setLoading(false)
    }
  }

  return (
    <div>
      <CustomLoaderSpinner loading={loading} />
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">
                        Sign in as an{' '}
                        <span className="text-primary">{type ? type : 'employee'}</span>
                      </p>
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          autoComplete="username"
                          name="username"
                          value={form.username}
                          onChange={changeValue}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          name="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={form.password}
                          onChange={changeValue}
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton
                            type="submit"
                            color="primary"
                            className="px-4"
                            onClick={handleSubmit}
                          >
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                      <div
                        className="text-muted fst-italic fw-light my-2"
                        style={{ fontSize: '1.3rem' }}
                      >
                        - OR -
                      </div>
                      <div>
                        {type && (
                          <CRow>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                              Login as an employee
                            </Link>
                          </CRow>
                        )}
                        {type !== 'admin' && (
                          <CRow>
                            <Link to="/login/admin" style={{ textDecoration: 'none' }}>
                              Login as an admin
                            </Link>
                          </CRow>
                        )}

                        {type !== 'insurance' && (
                          <CRow>
                            <Link to="/login/insurance" style={{ textDecoration: 'none' }}>
                              Login as an insurance admin
                            </Link>
                          </CRow>
                        )}
                      </div>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-black bg-white py-5" style={{ width: '50%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Medicare</h2>
                      <p>
                        Get coverage to all your medical expenses and claim history, from anywhere,
                        at any time.
                      </p>
                    </div>
                    <div style={{ width: '100%' }}>
                      <img style={{ maxWidth: '100%' }} src={Health_img} alt="advertisement" />
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  )
}
Login.propTypes = {
  type: PropTypes.string,
}
export default Login
