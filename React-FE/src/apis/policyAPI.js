import { urls, requests } from './configs'

export default {
  create: async (payload) => {
    return requests.post(`${urls.policies}`, payload)
  },
  getAll: async (params) => {
    return requests.get(urls.policies, params)
  },
  getById: async (id) => {
    return requests.getById(urls.policies, id)
  },
  update: async (id, payload) => {
    return requests.put(`${urls.policies}/${id}`, payload)
  },
  delete: async (id) => {
    return requests.delete(`${urls.policies}/${id}`)
  },
  confirm: async (id, payload) => {
    return requests.put(`${urls.policies}/confirm/${id}`, payload)
  },
}
