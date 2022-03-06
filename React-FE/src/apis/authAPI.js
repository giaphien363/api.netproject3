import { urls, requests } from './configs'

export default {
  login: async (type = 'employee', payload) => {
    return requests.post(`${urls.auth}/${type}/login`, payload)
  },
  getUserAuthInfo: async () => {
    return requests.get(urls.auth)
  },
  changePassword: async (payload) => {
    return requests.put(`${urls.auth}/update/password`, payload)
  },
}
