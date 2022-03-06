import { urls, requests } from './configs'

export default {
  getAll: async (params) => {
    return requests.get(urls.contracts, params)
  },
  getByEmployeeId: async (id) => {
    return requests.getById(urls.contracts, id)
  },
}
