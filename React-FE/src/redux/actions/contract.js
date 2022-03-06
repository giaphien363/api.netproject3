export const SAVE_POLICIES_IN_CONTRACT = 'SAVE_POLICIES_IN_CONTRACT'

export const savePoliciesInContract = (policies) => {
  return {
    type: SAVE_POLICIES_IN_CONTRACT,
    payload: policies,
  }
}
