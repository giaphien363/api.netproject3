import { combineReducers } from 'redux'

import userReducer from './user'
import insuranceCompanyReducer from './insuranceCompany'
import contractReducer from './contract'
import policyTypeReducer from './policyType'
import policyReducer from './policy'
import toastReducer from './toast'

const sideBarReducer = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE': {
      return action.payload
    }
    default: {
      return state
    }
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  insuranceCompany: insuranceCompanyReducer,
  contract: contractReducer,
  policyType: policyTypeReducer,
  policy: policyReducer,
  toast: toastReducer,
  sidebarShow: sideBarReducer,
})

export default rootReducer
