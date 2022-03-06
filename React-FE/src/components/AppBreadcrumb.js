import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useSelector } from 'react-redux'

import adminRoutes from '../routes_admin'
import employeeRoutes from '../routes_employee'
import insAdminRoutes from '../routes_insAdmin'
import { Roles } from 'src/constants'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const user = useSelector((state) => state.user)

  let routes
  switch (user.role) {
    case Roles.ADMIN:
      routes = adminRoutes
      break

    case Roles.EMPLOYEE:
      routes = employeeRoutes
      break

    default:
      routes = insAdminRoutes
      break
  }

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute.name
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      breadcrumbs.push({
        pathname: currentPathname,
        name: getRouteName(currentPathname, routes),
        active: index + 1 === array.length ? true : false,
      })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <Link to="/">Home</Link> /
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
