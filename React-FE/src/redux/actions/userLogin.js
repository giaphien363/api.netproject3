export const SAVE_USER_COMPANY = 'SAVE_USER_COMPANY'
export const saveUserLogin = (formData) => {
  return {
    type: 'ADD_USER',
    payload: formData,
  }
}

export const saveInsAdminCompany = (company) => ({ type: SAVE_USER_COMPANY, payload: company })
