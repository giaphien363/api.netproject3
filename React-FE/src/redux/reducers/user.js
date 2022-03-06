import { SAVE_USER_COMPANY } from '../actions/userLogin'

let currentUser = window.sessionStorage.getItem('userLogin') || ''
if (currentUser) {
  currentUser = JSON.parse(currentUser)
}

const initialState = {
  id: 0,
  username: '',
  role: '',
  company: null,
}

const userReducer = (state = currentUser.username ? currentUser : initialState, action) => {
  switch (action.type) {
    case 'ADD_USER': {
      return action.payload
    }
    case 'LOGOUT_USER': {
      return initialState
    }
    case SAVE_USER_COMPANY: {
      return {
        ...state,
        company: action.payload,
      }
    }
    default: {
      return state
    }
  }
}

export default userReducer
