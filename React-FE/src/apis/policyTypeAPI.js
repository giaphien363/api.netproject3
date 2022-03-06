import { urls, requests } from './configs'

export default {
  getAll: async () => {
    return requests.get(urls.policyTypes)
  },
  createOne: async (payload) => {
    return requests.post(urls.policyTypes, payload)
  },
  updateType: async (id, payload) => {
    return requests.put(`${urls.policyTypes}/${id}`, payload)
  },
  deleteType: async (id) => {
    return requests.delete(`${urls.policyTypes}/${id}`)
  },
}
