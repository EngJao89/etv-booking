import Axios from 'axios'

const ACCESS_TOKEN_KEY = 'etv-access-token'

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token: string | null) {
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  delete axios.defaults.headers.common.Authorization
}

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
