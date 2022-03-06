import { urls, requests } from './configs'

export default {
  create: async (payload) => {
    return requests.post(`${urls.contractPolicies}`, payload)
  },
  getAll: async (params) => {
    return requests.get(urls.contractPolicies, params)
  },
}
