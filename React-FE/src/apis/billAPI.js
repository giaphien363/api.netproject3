import { urls, requests } from './configs'

export default {
  getAllInsurance: async (params) => {
    return requests.get(urls.bill + '/insurance', params)
  },
  getAllAdmin: async (params) => {
    return requests.get(urls.bill, params)
  },
  getAllNormal: async (params) => {
    return requests.get(urls.bill, params)
  },
  getById: async (id) => {
    return requests.put(`${urls.bill}/${id}`)
  },
}
