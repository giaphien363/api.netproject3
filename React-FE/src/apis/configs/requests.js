import AXIOS from './baseAxios'

export default {
  get: async (route, paramsObj) => {
    let url = `api/${route}`
    if (paramsObj) url += `?${new URLSearchParams(paramsObj).toString()}`
    return AXIOS.get(url)
  },
  getById: async (route, id) => {
    return AXIOS.get(`api/${route}/${id}`)
  },
  put: async (route, payload) => {
    return AXIOS.put(`api/${route}`, payload)
  },
  post: async (route, payload) => {
    return AXIOS.post(`api/${route}`, payload)
  },
  delete: async (route) => {
    return AXIOS.delete(`api/${route}`)
  },
}
