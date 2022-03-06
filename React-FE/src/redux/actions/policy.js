export const SAVE_ACTIVE_POLICIES = 'SAVE_ACTIVE_POLICIES'
export const SAVE_PENDING_POLICIES = 'SAVE_PENDING_POLICIES'
export const SAVE_REJECTED_POLICIES = 'SAVE_REJECTED_POLICIES'
export const APPROVE_POLICY = 'APPROVE_POLICY'
export const REJECT_POLICY = 'REJECT_POLICY'

export const saveActivePolicies = (policies) => ({
  type: SAVE_ACTIVE_POLICIES,
  payload: policies,
})

export const savePendingPolicies = (policies) => ({
  type: SAVE_PENDING_POLICIES,
  payload: policies,
})

export const saveRejectedPolicies = (policies) => ({
  type: SAVE_REJECTED_POLICIES,
  payload: policies,
})

export const approvePolicy = (policy) => ({
  type: APPROVE_POLICY,
  payload: policy,
})

export const rejectPolicy = (policy) => ({
  type: REJECT_POLICY,
  payload: policy,
})
