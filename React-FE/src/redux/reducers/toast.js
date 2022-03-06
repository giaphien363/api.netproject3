import { ADD_TOAST } from 'src/redux/actions/toast'

const initialState = {
  stack: [],
}

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        stack: [...state.stack, action.payload],
      }

    default:
      return state
  }
}

export default toastReducer
