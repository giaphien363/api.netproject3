import { urls, requests } from './configs'

export default {
  create: async (payload) => {
    console.log(payload)
    return requests.post(`${urls.employees}`, payload)
  },
  getAll: async (params) => {
    return requests.get(urls.employees, params)
  },
  getEmployee: async (id) => {
    return requests.get(`${urls.employees}/${id}`)
  },
  updateEmployee: async (id, payload) => {
    return requests.put(`${urls.employees}/${id}`, payload)
  },
  delete: async (id) => {
    return requests.delete(`${urls.employees}/${id}`)
  },
}
