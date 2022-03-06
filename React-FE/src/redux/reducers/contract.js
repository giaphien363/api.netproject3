import { SAVE_POLICIES_IN_CONTRACT } from 'src/redux/actions/contract'

const initialState = {
  policies: [],
}

const contractReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_POLICIES_IN_CONTRACT:
      return {
        ...state,
        policies: action.payload,
      }

    default:
      return state
  }
}

export default contractReducer
