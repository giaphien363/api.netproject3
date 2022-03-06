import { urls, requests } from './configs'

export default {
  create: async (payload) => {
    return requests.post(`${urls.claims}`, payload)
  },
  getAll: async (params) => {
    return requests.get(`${urls.claims}`, params)
  },
  getAllInsAdmin: async (params) => {
    return requests.get(`${urls.claims}/insurance`, params)
  },
  getById: async (id) => {
    return requests.getById(urls.claims, id)
  },
  update: async (id, payload) => {
    return requests.put(`${urls.claims}/${id}`, payload)
  },
  updateStatus: async (id, payload) => {
    return requests.put(`${urls.claims}/${id}/update-status`, payload)
  },
  delete: async (id) => {
    return requests.delete(`${urls.claims}/${id}`)
  },
}
