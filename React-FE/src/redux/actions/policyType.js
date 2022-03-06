export const SAVE_POLICY_TYPES = 'SAVE_POLICY_TYPES'

export const saveAllPolicyTypes = (types) => {
  return {
    type: SAVE_POLICY_TYPES,
    payload: types,
  }
}
