import axios from 'axios'

function getCookie(cname) {
  let name = cname + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

const baseAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // || process.env.REACT_APP_BASE_URL_API || 'http://localhost:8008',
})

baseAxios.interceptors.request.use((config) => {
  const token = getCookie('token')
  if (token) {
    config.headers.common.Accept = 'application/json'
    config.headers.common.Authorization = `Bearer ${token}`
  }

  return config
})
baseAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      window.sessionStorage.setItem('userLogin', '')
      document.cookie = 'token= ;'
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default baseAxios
