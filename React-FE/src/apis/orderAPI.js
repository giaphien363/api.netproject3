import { urls, requests } from './configs'

export default {
  create: async (payload) => {
    return requests.post(`${urls.order}`, payload)
  },
  getAll: async (params) => {
    return requests.get(urls.order, params)
  },
  updateStatus: async (id, statusId) => {
    return requests.put(`${urls.order}/${id}/update-status`, { status: statusId })
  },
  deleteOrder: async (id) => {
    return requests.delete(`${urls.order}/${id}`)
  },
}
// api/PolicyOrders/{id}/update-status
