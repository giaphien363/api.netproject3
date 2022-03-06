import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CContainer, CSpinner, CToaster } from '@coreui/react'
import { useSelector } from 'react-redux'

// routes config
import adminRoutes from '../routes_admin'
import employeeRoutes from '../routes_employee'
import insAdminRoutes from '../routes_insAdmin'
import { SimpleToast } from './toasts'
import { Roles } from 'src/constants'

const AppContent = () => {
  const toasts = useSelector((state) => state.toast).stack
  const user = useSelector((state) => state.user)

  let routes, defaultRoute
  switch (user.role) {
    case Roles.ADMIN:
      routes = adminRoutes
      defaultRoute = '/reports'
      break

    case Roles.EMPLOYEE:
      routes = employeeRoutes
      defaultRoute = '/my-contract'
      break

    default:
      routes = insAdminRoutes
      defaultRoute = '/claims'
      break
  }

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Switch>
          {routes.map((route, idx) => {
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={(props) => (
                    <>
                      <route.component {...props} />
                    </>
                  )}
                />
              )
            )
          })}
          <Redirect from="/" to={defaultRoute} />
        </Switch>
      </Suspense>
      <CToaster placement="top-end">
        {toasts.map((toast, index) => (
          <SimpleToast key={index} message={toast.message} variant={toast.variant} />
        ))}
      </CToaster>
    </CContainer>
  )
}

export default React.memo(AppContent)
