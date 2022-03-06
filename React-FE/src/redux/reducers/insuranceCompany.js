import { SAVE_INSURANCE_COMPANIES } from 'src/redux/actions/insuranceCompany'

const initialState = {
  list: [],
}

const insuranceCompanyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_INSURANCE_COMPANIES:
      return {
        ...state,
        list: action.payload,
      }

    default:
      return state
  }
}

export default insuranceCompanyReducer
