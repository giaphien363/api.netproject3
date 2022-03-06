import React from 'react'
import { CTableDataCell, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilX, cilCheckAlt } from '@coreui/icons'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { PolicyStatus, Roles } from 'src/constants'
import { approvePolicy, rejectPolicy } from 'src/redux/actions/policy'
import { addToast } from 'src/redux/actions/toast'
import { policyAPI } from 'src/apis'

const PendingPoliciesTableRow = ({ policy, onViewDetails, onDelete }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const confirm = async (status) => {
    await policyAPI.confirm(policy.id, { status })
    const message =
      status === PolicyStatus.ACTIVE
        ? `Approved policy "${policy.name}".`
        : `Rejected policy "${policy.name}".`
    dispatch(addToast({ message }))

    let updateAction = PolicyStatus.ACTIVE ? approvePolicy : rejectPolicy
    dispatch(updateAction(policy))
  }

  return (
    <CTableRow>
      <CTableDataCell role="button" onClick={() => onViewDetails(policy)}>
        <div className="text-primary text-start">{policy.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => onViewDetails(policy)} className="text-start">
        <div>{policy.description}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => onViewDetails(policy)}>
        <div>{policy.company.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => onViewDetails(policy)}>
        <div>{policy.type.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => onViewDetails(policy)}>
        <div>{policy.supportPercent}%</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => onViewDetails(policy)}>
        <div>{policy.durationInDays} days</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => onViewDetails(policy)}>
        <div>${policy.price.toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell className="text-center">
        {[Roles.IMANAGER, Roles.IFINMAN].includes(user.role) ? (
          <CIcon size="xl" icon={cilTrash} role="button" onClick={() => onDelete(policy)} />
        ) : (
          <>
            <CIcon
              size="xl"
              className="text-success"
              icon={cilCheckAlt}
              role="button"
              onClick={() => confirm(PolicyStatus.ACTIVE)}
            />
            <CIcon
              size="xl"
              className="text-danger"
              icon={cilX}
              role="button"
              onClick={() => confirm(PolicyStatus.REJECTED)}
            />
          </>
        )}
      </CTableDataCell>
    </CTableRow>
  )
}

PendingPoliciesTableRow.propTypes = {
  policy: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default PendingPoliciesTableRow
