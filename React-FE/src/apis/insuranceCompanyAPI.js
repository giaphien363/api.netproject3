import { urls, requests } from './configs'

export default {
  create: async (payload) => {
    return requests.post(`${urls.insuranceCompanies}`, payload)
  },
  getAll: async (params) => {
    return requests.get(urls.insuranceCompanies, params)
  },
  update: async (id, payload) => {
    return requests.put(`${urls.insuranceCompanies}/${id}`, payload)
  },
  delete: async (id) => {
    return requests.delete(`${urls.insuranceCompanies}/${id}`)
  },
}
