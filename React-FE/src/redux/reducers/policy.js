import {
  SAVE_ACTIVE_POLICIES,
  SAVE_PENDING_POLICIES,
  SAVE_REJECTED_POLICIES,
  APPROVE_POLICY,
  REJECT_POLICY,
} from 'src/redux/actions/policy'
import { stringUtils, toOldPolicyResponse } from 'src/utils'

const initialState = {
  active: [],
  pending: [],
  rejected: [],
}

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_ACTIVE_POLICIES:
      return {
        ...state,
        active: action.payload.map(toOldPolicyResponse),
      }
    case SAVE_PENDING_POLICIES:
      return {
        ...state,
        pending: action.payload.map(toOldPolicyResponse),
      }
    case SAVE_REJECTED_POLICIES:
      return {
        ...state,
        rejected: action.payload.map(toOldPolicyResponse),
      }
    case APPROVE_POLICY:
      return {
        ...state,
        active: [...state.active, action.payload].sort(stringUtils.sortAlphabetically),
        pending: state.pending.filter((p) => p.id !== action.payload.id),
      }
    case REJECT_POLICY:
      return {
        ...state,
        rejected: [...state.rejected, action.payload].sort(stringUtils.sortAlphabetically),
        pending: state.pending.filter((p) => p.id !== action.payload.id),
      }
    default:
      return state
  }
}

export default toastReducer
