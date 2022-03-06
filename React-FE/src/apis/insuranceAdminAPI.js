import { urls, requests } from './configs'

export default {
  getById: async (id) => {
    return requests.getById(urls.insuranceAdmins, id)
  },
  create: async (payload) => {
    return requests.post(`${urls.insuranceAdmins}`, payload)
  },
  getAll: async (params) => {
    return requests.get(urls.insuranceAdmins)
  },
  update: async (id, payload) => {
    return requests.put(`${urls.insuranceAdmins}/${id}`, payload)
  },
  delete: async (id) => {
    return requests.delete(`${urls.insuranceAdmins}/${id}`)
  },
}
