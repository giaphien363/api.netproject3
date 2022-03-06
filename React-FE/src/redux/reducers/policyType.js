import { SAVE_POLICY_TYPES } from 'src/redux/actions/policyType'

const initialState = {
  list: [],
}

const policyTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_POLICY_TYPES:
      return {
        ...state,
        list: action.payload,
      }

    default:
      return state
  }
}

export default policyTypeReducer
