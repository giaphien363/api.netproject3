export const SAVE_INSURANCE_COMPANIES = 'SAVE_INSURANCE_COMPANIES'

export const saveAllCompanies = (companies) => {
  return {
    type: SAVE_INSURANCE_COMPANIES,
    payload: companies,
  }
}
